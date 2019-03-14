package com.soumasoft.rocwct.server;

import com.soumasoft.rocwct.server.config.ConsoleParam;
import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.console.ConsolePrinter;
import com.soumasoft.rocwct.server.util.InstallHelper;
import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class Main {

	public static void main(String[] args) throws Exception {
		
		// install mode
		if (ConsoleParam.getBoolean(ConsoleParam.INSTALL)) {			
			System.out.println("RocWCT install mode"); // don't use Log4j --> log4j2.xml may not exist  
			new InstallHelper().install();
			return;
		}
		
		// initialize properties
		if (!Properties.init()) {
			log.fatal("ERROR on loading settings - not able to start RocWCT server. Please check previouse messages for further details.");
			return;
		}	
		
		// shutdown mode
		if (ConsoleParam.getBoolean(ConsoleParam.SHUTDOWN)) {
			log.info("SHUTDOWN! New RocWCT instance started for sending shutdown command to the WebSocket!");
			ShutdownHelper.shutdownOtherInstance();
			return;
		}

		ConsolePrinter.printRuntimeInfo();
		
		Taskmanager.start();

	

	}


}
