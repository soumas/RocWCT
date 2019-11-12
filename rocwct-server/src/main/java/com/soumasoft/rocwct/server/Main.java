package com.soumasoft.rocwct.server;

import org.apache.logging.log4j.LogManager;

import com.soumasoft.rocwct.server.config.ConsoleParam;
import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.console.ConsolePrinter;
import com.soumasoft.rocwct.server.util.InstallHelper;
import com.soumasoft.rocwct.server.util.ShutdownHelper;

//don't use Log4j in Main --> log4j2.xml may not exist in install mode
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
			LogManager.getLogger().fatal("ERROR on loading settings - not able to start RocWCT server. Please check previouse messages for further details.");
			return;
		}	
		
		// shutdown mode
		if (ConsoleParam.getBoolean(ConsoleParam.SHUTDOWN)) {
			LogManager.getLogger().info("SHUTDOWN! New RocWCT instance started for sending shutdown command to the WebSocket!");
			ShutdownHelper.shutdownOtherInstance();
			return;
		}

		ConsolePrinter.printRuntimeInfo();
		
		Taskmanager.start();

	

	}


}
