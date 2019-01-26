package com.soumasoft.rocwct.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.Callable;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class ConsoleReader implements Callable<Void> {
	@Override

	public Void call() throws Exception {
		
		log.info("Enter 'q' to stop RocWCT server...");
		
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		while (true) {
			try {
				String input = br.readLine();
				if (input.equals("q")) {
					break;
				}
			} catch (IOException e) {
				log.error(e);
			}
		}

		Main.running = false;

		return null;
	}

}
