package com.soumasoft.rocwct.server.web.http;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class RocWctHttpServerManager {

	// singleton instance
	private static RocWctHttpServerManager instance = new RocWctHttpServerManager();
	private RocWctHttpServerManager() { /* private constructor */ }
	public static RocWctHttpServerManager getInstance() {
		return instance;
	}

	private HttpServer httpServer;

	private String host;
	private int port;
	private boolean stopped;

	public void start(String host, int port) {
		this.host = host;
		this.port = port;
		startInternal();
	}

	private void startInternal() {
		if (stopped) {
			return;
		}
		System.out.println(String.format("Rocrail-WCP WcpHttpServer: starting static http server at %s:%d", host, port));

		try {
			httpServer = HttpServer.create();
			
			httpServer.createContext("/", new RocWctHttpHandler("C:\\Users\\thomas\\git\\RocWCT\\code\\rocwct-client\\httpdocs", false, false));
			httpServer.bind(new InetSocketAddress(host, port), 100);
			httpServer.start();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void stop() {
		log.info("Rocrail-WCP WcpHttpServer: closing...");		
		httpServer.stop(0);
		log.info("CCCLLOOOSSEED");			
	}
}
