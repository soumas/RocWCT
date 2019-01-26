package com.soumasoft.rocwct.server;

import java.nio.file.Paths;

import com.soumasoft.rocwct.server.config.ConsoleParam;
import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class Main {

	

	public static void main(String[] args) throws Exception {

		// initialize properties
		if (!Properties.init()) {
			log.fatal("Error on loading settings - not able to start RocWCT server. Please check previouse messages for further details.");
			return;
		}
		
		if (ConsoleParam.getBoolean(ConsoleParam.SHUTDOWN)) {
			log.info("SHUTDOWN! New RocWCT instance started for sending shutdown command to the WebSocket!");
			ShutdownHelper.shutdownOtherInstance();
			return;
		}

		printRuntimeInfo();
		
		Taskmanager.start();

		log.info("RocWCT server stopped");

	}
	
	private static void printRuntimeInfo() {

		StringBuilder sb = new StringBuilder(System.getProperty("line.separator"));
		sb.append("   _____         __          _______ _______ " + System.getProperty("line.separator"));
		sb.append("  |  __ \\        \\ \\        / / ____|__   __|" + System.getProperty("line.separator"));
		sb.append("  | |__) |___   __\\ \\  /\\  / / |       | |   " + System.getProperty("line.separator"));
		sb.append("  |  _   / _ \\ / __\\ \\/  \\/ /| |       | |   " + System.getProperty("line.separator"));
		sb.append("  | | \\ \\ (_) | (__ \\  /\\  / | |____   | |   " + System.getProperty("line.separator"));
		sb.append("  |_|  \\_\\___/ \\___| \\/  \\/   \\_____|  |_|   " + System.getProperty("line.separator"));
		sb.append("---------------------------------------------------" + System.getProperty("line.separator"));
		sb.append("  Copyright (c) 2019 Thomas Juen, soumasoft.com" + System.getProperty("line.separator"));
		sb.append("  RocWCT server is provided under the MIT license" + System.getProperty("line.separator"));
		sb.append("---------------------------------------------------" + System.getProperty("line.separator"));
		sb.append("  Version: " + Main.class.getPackage().getImplementationVersion()
				+ System.getProperty("line.separator"));
		sb.append("  Console Params: " + ConsoleParam.getSummary() + System.getProperty("line.separator"));
		sb.append("  Properties: " +  Properties.getSummary() + System.getProperty("line.separator"));
		sb.append("  Process ID: " + Thread.currentThread().getId() + System.getProperty("line.separator"));
		sb.append("---------------------------------------------------");
		log.info(sb.toString());

		// some additional debug infos
		sb = new StringBuilder(System.getProperty("line.separator"));
		sb.append("  Execution location: " + Paths.get("").toAbsolutePath().toString() + System.getProperty("line.separator"));
		sb.append("  System properties: " + System.getProperties().toString() + System.getProperty("line.separator"));
		sb.append("---------------------------------------------------");
		log.debug(sb.toString());
	}

}
