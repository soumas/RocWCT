package com.soumasoft.rocwct.server.rcp;

import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RocrailSocket implements Runnable {

	private static final int MSGLOOP_DELAY_MILLIS = 5;
	private static final int SOCKET_READ_TIMEOUT_MILLIS = 1000;
	private static Pattern REGEX_COMMAND_HEADER_SIZES = Pattern.compile("<(?<type>\\w+)\\s+size=\\\"(?<size>\\d+)");

	private RocrailSocketManager comMgr;
	private Consumer<String> onInMessage;
	private Consumer<Exception> onException;
	private Consumer<RocrailSocket> onThreadStop;

	public RocrailSocket(RocrailSocketManager comMgr, Consumer<String> onInMessage, Consumer<Exception> onException,
			Consumer<RocrailSocket> onThreadStop) {
		this.comMgr = comMgr;
		this.onInMessage = onInMessage;
		this.onException = onException;
		this.onThreadStop = onThreadStop;
	}

	@Override
	public void run() {

		Socket socket = null;
		InputStreamReader reader = null;
		OutputStreamWriter writer = null;
		try {

			socket = new Socket(comMgr.getHost(), comMgr.getPort());
			socket.setSoTimeout(SOCKET_READ_TIMEOUT_MILLIS);

			reader = new InputStreamReader(socket.getInputStream(), "UTF-8");
			writer = new OutputStreamWriter(socket.getOutputStream(), "UTF-8");

			char[] currentChar = new char[1];
			StringBuilder inBuffer = new StringBuilder();
			int millisSinceLastCom = 0;

			while (true) {

				if (comMgr.isStopped()) {
					break;
				}

				// send queued commands
				String cmd;
				while ((cmd = comMgr.getOutMessageQueue().poll()) != null) {
					writer.write(buildRCPCommand(cmd));
					writer.flush();
				}

				// read next character and append to inBuffer
				if (reader.ready()) {

					// reset timer for last communication
					millisSinceLastCom = 0;

					// read next character from socket
					reader.read(currentChar);

					inBuffer.append(currentChar[0]);

					// if inBuffer contains '</xmlh>' the header is complete (currentChar=='>' is
					// for better performance)
					if (currentChar[0] == '>' && inBuffer.indexOf("</xmlh>") > 0) {
						int sizeXml = 0;
						int sizeBin = 0;
						Matcher m = REGEX_COMMAND_HEADER_SIZES.matcher(inBuffer);
						while (m.find()) {
							String type = m.group("type");
							int size = Integer.parseInt(m.group("size"));

							if ("bin".equals(type)) {
								System.out.println("Info: Content of type bin is not yet supported!");
								sizeBin = size;
							} else if ("xml".equals(type)) {
								sizeXml = size;
							} else {
								System.out.println(String.format("Warning: received unknown type (%s)!", type));
							}
						}

						// clear inBuffer
						inBuffer.setLength(0);

						if (sizeXml == 0 && sizeBin == 0) {
							System.err.println("Error: no size information for command found! Ignore command!");
							break;
						} else {
							// read xml command
							for (int i = 0; i < sizeXml; i++) {
								reader.read(currentChar);
								if (currentChar[0] != '\r' && currentChar[0] != '\n') {
									inBuffer.append(currentChar[0]);
								}
							}
							// read bin data
							for (int i = 0; i < sizeBin; i++) {
								// bin data currently not handeled by rocrail wcp
								reader.read();
							}							
							if (inBuffer.length() > 0 && onInMessage != null) {
								onInMessage.accept(inBuffer.toString());
							}
						}
					}
				} else {
					Thread.sleep(MSGLOOP_DELAY_MILLIS);
					millisSinceLastCom += MSGLOOP_DELAY_MILLIS;

					// check connection after 10 seconds of silence
					if (millisSinceLastCom > 10000) {
						try {
							int result = reader.read();
							if(result == -1) {
								throw new RuntimeException("Connection to Rocrail Server lost!");		
							}
						} catch (SocketTimeoutException e) {
							/* if we get a timeout the socket is alive */
						}
						millisSinceLastCom = 0;
					}
				}
			}
		} catch (Exception e1) {
			if (onException != null) {
				onException.accept(e1);
			}
		} finally {
			try {
				reader.close();
			} catch (Exception e) {
				/* ignore */ }
			try {
				writer.close();
			} catch (Exception e) {
				/* ignore */ }
			try {
				socket.close();
			} catch (Exception e) {
				/* ignore */ }
		}

		if (onThreadStop != null) {
			onThreadStop.accept(this);
		}

	}

	private String buildRCPCommand(String cmd) {
		return String.format("<xmlh><xml size=\"%d\" name=\"%s\"/></xmlh>%s", cmd.length(), "lc", cmd);
	}

}
