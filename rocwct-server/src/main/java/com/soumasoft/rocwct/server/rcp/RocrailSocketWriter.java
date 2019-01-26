package com.soumasoft.rocwct.server.rcp;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.extern.log4j.Log4j2;

/**
 * This Runnable class is responsible for sending  
 * messages out to the Rocrail server.
 *  
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public class RocrailSocketWriter implements Runnable {
	
	/**
	 * Regex to check if Command for Rocrail may be in valid form
	 */
	private static final Pattern RCP_COMMAND_VALIDATOR_REGEX = Pattern.compile("<(?<xmltyp>[a-zA-Z]+).*/>");	
	
	/**
	 * The task that has started the thread for this instance.
	 */
	private RocrailSocketTask task;
	
	/**
	 * The Stream writer 
	 */
	private OutputStreamWriter writer = null;

	public RocrailSocketWriter(RocrailSocketTask task) throws UnsupportedEncodingException, IOException {
		this.task = task;
		this.writer = new OutputStreamWriter(task.getSocket().getOutputStream(), "UTF-8");
	}

	@Override
	public void run() {

		log.debug("Rocrail socket writer is running");

		while (true) {
			try {
				// blocking read waits for the next command
				String cmd = this.task.getOutMessageQueue().take();
				// if shutdown --> break infinite loop
				if(ShutdownHelper.SHUTDOWNCOMMAND.equals(cmd)) {
					break;
				}
				
				Matcher m = RCP_COMMAND_VALIDATOR_REGEX.matcher(cmd);
				if(!m.matches()) {
					log.error(String.format("Invalid RCP command: '%s' will not be routed to Rocrail!", cmd));
					continue;
				}
				
				String typ = m.group("xmltyp");
				String command = buildRCPCommand(cmd, typ);
				
				log.trace(command);
				// write RCP command to the Rocrail socket
				writer.write(command);
				writer.flush();
			} catch (Exception e) {
				log.error(e);
			}
		}
		
		if(writer != null) {
			try {
				writer.close();
			} catch (IOException e) {
				log.error("Error on closing OutputStreamWriter",e);
			}
		}
	}

	/**
	 * Enriches the naked RCP command with header informations 
	 * @param cmd
	 * @param xmltyp
	 * @return
	 */
	private String buildRCPCommand(String cmd, String xmltyp) {
		return String.format("<xmlh><xml size=\"%d\" name=\"%s\"/></xmlh>%s", cmd.length(), xmltyp, cmd);
	}
}
