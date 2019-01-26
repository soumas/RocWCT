package com.soumasoft.rocwct.server;

import java.util.concurrent.Callable;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class MyTestRunnable implements Callable<MyTestRunnable> {

	@Override
	public MyTestRunnable call() throws Exception {
		while(Main.running) {
			log.info("still running...");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				log.error(e);
			}
		}
		return this;
	}

}
