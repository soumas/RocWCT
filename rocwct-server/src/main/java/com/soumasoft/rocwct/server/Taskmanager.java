package com.soumasoft.rocwct.server;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import com.soumasoft.rocwct.server.config.ConsoleParam;
import com.soumasoft.rocwct.server.console.ConsoleReaderTask;
import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;
import com.soumasoft.rocwct.server.rcp.RocrailSocketTask;
import com.soumasoft.rocwct.server.web.http.RocWctHttpServerTask;
import com.soumasoft.rocwct.server.web.socket.RocWctWebSocketTask;

import lombok.extern.log4j.Log4j2;

/**
 * The Taskmanager starts, holds and provides all RocWCT Tasks.
 * 
 * @author Thomas Juen, SoumaSoft
 */
@Log4j2
public class Taskmanager {

	public static volatile List<AbstractRocWctTask> tasks = new ArrayList<>();

	public static void start() throws Exception {

		tasks.add(new RocWctWebSocketTask());
		tasks.add(new RocWctHttpServerTask());
		tasks.add(new RocrailSocketTask());
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
		for (Future<?> f : futures) {
			f.get();
		}

		executor.shutdownNow();
		
		log.info("RocWCT server stopped");

	}
	
	@SuppressWarnings("unchecked")
	public static <T extends AbstractRocWctTask> T getTask(Class<T> clazz) {
		
		for(AbstractRocWctTask task : tasks) {
			if(task.getClass().getCanonicalName().equals(clazz.getCanonicalName())) {
				return (T)task;
			}
		}
		throw new RuntimeException("Task not found! "+clazz.getCanonicalName());
	}
}
