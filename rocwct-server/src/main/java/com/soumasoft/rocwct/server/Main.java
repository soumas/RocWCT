package com.soumasoft.rocwct.server;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import com.soumasoft.rocwct.server.config.ConsoleParam;
import com.soumasoft.rocwct.server.config.Properties;
import com.soumasoft.rocwct.server.console.ConsoleReaderTask;
import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;
import com.soumasoft.rocwct.server.rcp.RocrailSocketTask;
import com.soumasoft.rocwct.server.util.ShutdownHelper;
import com.soumasoft.rocwct.server.web.http.RocWctHttpServerTask;
import com.soumasoft.rocwct.server.web.socket.RocWctWebSocketTask;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class Main {

	public static volatile List<AbstractRocWctTask> tasks = new ArrayList<>();

	public static void main(String[] args) throws IOException, InterruptedException, ExecutionException {

		if (!Properties.init()) {
			log.fatal("Error on loading settings - not able to start RocWCT server. Please check previouse messages for further details.");
		}

		if (ConsoleParam.getBoolean(ConsoleParam.SHUTDOWN)) {
			ShutdownHelper.shutdownOtherInstance();
			return;
		}

		printRuntimeInfo();

		tasks.add(new RocWctWebSocketTask());
		tasks.add(new RocWctHttpServerTask());
		tasks.add(new RocrailSocketTask());
		// start console watchter if not service runtime
		if (!ConsoleParam.getBoolean(ConsoleParam.SERVICERUNTIME)) {
			tasks.add(new ConsoleReaderTask());
		}
		
		// execute all tasks
		List<Future<?>> futures = new ArrayList<Future<?>>();
		final ExecutorService executor = Executors.newFixedThreadPool(tasks.size());
		
		tasks.forEach(task -> {
			futures.add(executor.submit(task));
		});
		
		// wait for all futures
		for(Future<?> f : futures) {
			f.get();
		}
		
		executor.shutdownNow();

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
