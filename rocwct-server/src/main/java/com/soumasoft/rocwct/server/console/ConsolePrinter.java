package com.soumasoft.rocwct.server.console;

import java.nio.file.Paths;

import com.soumasoft.rocwct.server.Main;
import com.soumasoft.rocwct.server.config.ConsoleParam;
import com.soumasoft.rocwct.server.config.Properties;

import lombok.extern.log4j.Log4j2;

/**
 * Dead simple helper for printing out system informations
 * 
 * @author Thomas Juen, SoumaSoft
 */
@Log4j2
public class ConsolePrinter {
	
	public static void printRuntimeInfo() {

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
