package com.soumasoft.rocwct.server.rcp;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;
import org.json.XML;

import com.soumasoft.rocwct.server.Taskmanager;
import com.soumasoft.rocwct.server.util.ShutdownHelper;
import com.soumasoft.rocwct.server.web.socket.RocWctWebSocketTask;

import lombok.extern.log4j.Log4j2;

/**
 * This Runnable class is responsible for reading  
 * messages from the Rocrail server and rout the
 * messages to the WebSocket task.
 *  
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public class RocrailSocketReader implements Runnable {

	/**
	 * The Rocrail server sends a clock event every minute. If our reader
	 * does not receive any message within a minute (+5 seconds buffer) we know
	 * that anything is not ok and we have to reconnect to Rocrail server.
	 */
	private static final int SOCKET_READ_TIMEOUT = 65000;
	
	
	private static final Pattern REGEX_COMMAND_HEADER_SIZES = Pattern.compile("<(?<type>\\w+)\\s+size=\\\"(?<size>\\d+)");
	
	private RocrailSocketTask task;
	private InputStreamReader reader;

	public RocrailSocketReader(RocrailSocketTask task) throws UnsupportedEncodingException, IOException {
		this.task = task;		
		this.task.getSocket().setSoTimeout(SOCKET_READ_TIMEOUT);		
		this.reader = new InputStreamReader(task.getSocket().getInputStream(), "UTF-8");
	}

	@Override
	public void run() {
		
		log.debug("Rocrail socket reader is running");
		
		StringBuilder inBuffer = new StringBuilder();
		char[] currentChar = new char[1];
		// counter for logging
		long commandId = 0;
		
		while (true) {
			try {
				// read next char from socket
				reader.read(currentChar);
				inBuffer.append(currentChar[0]);
				
				// when rocrail sever closes the socket, the reader get's an endless amount of blanks
				if(inBuffer.length() > 9999 && !inBuffer.toString().matches("[A-Za-z]{1,}")) {
					throw new RuntimeException("Rocrail socket seems to have no good data for RocWCT server. The socket may be blind... try to reconnect!");
				}
				
				// if inBuffer contains '</xmlh>' the header is complete (currentChar[0] == '>' is just for better performance)
				if (currentChar[0] == '>' && inBuffer.indexOf("</xmlh>") > 0) {
					
					commandId = (commandId+1) % (Long.MAX_VALUE-1);
					
					log.trace(commandId + " RCP header:  " + inBuffer.toString().replace("\n", "").replace("\r", ""));
					
					int sizeXml = 0;
					int sizeBin = 0;
					
					Matcher m = REGEX_COMMAND_HEADER_SIZES.matcher(inBuffer);
					
					while (m.find()) {
						String type = m.group("type");
						int size = Integer.parseInt(m.group("size"));
						if ("bin".equals(type)) {
							log.warn(commandId + " BIN commands are not yet supported by RocWCT server!");
							sizeBin = size;
						} else if ("xml".equals(type)) {
							sizeXml = size;
						} else {
							log.warn(String.format(commandId + " Unsupported command type: %s", type));
						}
					}

					// clear inBuffer for upcomming command
					inBuffer.setLength(0);

					if (sizeXml == 0 && sizeBin == 0) {
						log.error(commandId + " No size information found! RocWCT server ignores this command");
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
						if (inBuffer.length() > 0) {
							log.trace(commandId + " RCP command: " + inBuffer.toString().replace("\n", "").replace("\r", ""));
							JSONObject xmlJSONObj = XML.toJSONObject(inBuffer.toString());
							Taskmanager.getTask(RocWctWebSocketTask.class).broadcast(xmlJSONObj.toString());
							
						} else {
							log.error(commandId + " RCP command was empty!");
						}
					}
					
					// clear inBuffer for upcomming header
					inBuffer.setLength(0);
				}
				
			} catch (Exception e) {
				if (!task.isShutdownInProgress()) {
					log.error("Unexpected Exception while reading from Rocrail server!");
					log.error(e);
					log.error("Try to reconnect...");
					
					// force the writer-thread to shutdown because rocrail is not connected anymore 
					// (writer does not get informed about that by the socket, see https://github.com/soumas/RocWCT/issues/4) 
					task.enqueueRocrailCommand(ShutdownHelper.SHUTDOWNCOMMAND);
					
					// restart establishing connection to rocrail server
					task.setupRocrailConnectionAsync();
				} 
				break;
			}
		}
	}

}
