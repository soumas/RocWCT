package com.soumasoft.rocwct.server.console;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import com.soumasoft.rocwct.server.itc.AbstractRocWctTask;
import com.soumasoft.rocwct.server.util.ShutdownHelper;

import lombok.Synchronized;
import lombok.extern.log4j.Log4j2;

/**
 * This class is used to read commands from console input if RocWCT server is
 * not running as system service. The worker thread uses BAD BUSY WAITING
 * because I was not able to get a thread going down gracefully when it is
 * blocked by read(). Maybe there is a better solution out there - if so...
 * please change code and commit - it's open source ;)
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public class ConsoleReaderTask extends AbstractRocWctTask {

	private static Thread consoleReaderThread;

	@Override
	protected void onStart() {
		initAndStart();
	}

	@Synchronized
	private void initAndStart() {
		consoleReaderThread = new Thread(() -> {
			log.info(String.format("ConsoleReader is up and waiting for commands. Enter command '%s' to stop RocWCT server.", ShutdownHelper.SHUTDOWNCOMMAND));
			BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
			for (;;) {
				try {
					if (br.ready()) {
						String input = br.readLine();
						if (input.equals(ShutdownHelper.SHUTDOWNCOMMAND)) {
							ShutdownHelper.shutdownThisInstance();
						} else {
							log.warn(String.format("Unknown command: %s", input));
						}
					}
					Thread.sleep(100);
				} catch (InterruptedException e) {
					break;
				} catch (Exception e) {
					log.error("Error during infinite loop!", e);
				}
			}
			log.debug("ConsoleReader is closed now");
		});
		consoleReaderThread.start();
	}

	@Override
	protected void onShutdown() throws IOException, InterruptedException {
		if (consoleReaderThread != null) {
			consoleReaderThread.interrupt();
			consoleReaderThread.join(1000);
		}
	}

}
