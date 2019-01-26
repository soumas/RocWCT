package com.soumasoft.rocwct.server.web.http;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

import org.json.JSONArray;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class RocWctHttpHandler implements HttpHandler {
	private static Map<String, Asset> data = new HashMap<>();
	private final boolean caching, gzip;
	private final String pathToRoot;

	public RocWctHttpHandler(String pathToRoot, boolean caching, boolean gzip) throws IOException {
		this.caching = caching;
		this.pathToRoot = pathToRoot.endsWith("/") ? pathToRoot : pathToRoot + "/";
		this.gzip = gzip;

		File[] files = new File(pathToRoot).listFiles();
		if (files == null) {
			throw new IllegalStateException("Couldn't find webroot: " + pathToRoot);
		}
		for (File f : files) {
			processFile("", f, gzip);
		}
	}

	private static class Asset {
		public final byte[] data;

		public Asset(byte[] data) {
			this.data = data;
		}
	}

	@Override
	public void handle(HttpExchange httpExchange) throws IOException {
		String path = httpExchange.getRequestURI().getPath();
		try {
			path = path.substring(1);
			path = path.replaceAll("//", "/");

			// default file is index.html
			if (path.length() == 0) {
				path = "index.html";
			}
			
			// special request for rocrail-wcp-components.json
			if ("dynamic-rocrail-wcp-components.json".equals(path)) {
				String pathToWebComponentJsFiles = pathToRoot + "components/";
				String[] fileNames = new File(pathToWebComponentJsFiles).list(new FilenameFilter() {
					@Override
					public boolean accept(File dir, String name) {
						return name.endsWith(".js");
					}
				});
				byte[] data = new JSONArray(fileNames).toString().getBytes("UTF-8");
				
				httpExchange.getResponseHeaders().set("Content-Type", "application/json");
				httpExchange.sendResponseHeaders(200, data.length);
				httpExchange.getResponseBody().write(data);
				httpExchange.getResponseBody().close();
				return;					
			}

			if (!new File(pathToRoot + path).exists()) {
				System.err.println("404 NOT FOUND: " + path);
				httpExchange.sendResponseHeaders(404, -1);
				return;
			}

			InputStream in = new FileInputStream(pathToRoot + path);
			Asset res = caching ? data.get(path) : new Asset(readResource(in, gzip));

			if (gzip) {
				httpExchange.getResponseHeaders().set("Content-Encoding", "gzip");
			}
			
			if (path.endsWith(".js")) {
				httpExchange.getResponseHeaders().set("Content-Type", "text/javascript");
			} else if (path.endsWith(".html")) {
				httpExchange.getResponseHeaders().set("Content-Type", "text/html");
			} else if (path.endsWith(".css")) {
				httpExchange.getResponseHeaders().set("Content-Type", "text/css");
			} else if (path.endsWith(".json")) {
				httpExchange.getResponseHeaders().set("Content-Type", "application/json");
			} else if (path.endsWith(".svg")) {
				httpExchange.getResponseHeaders().set("Content-Type", "image/svg+xml");
			}

			if (httpExchange.getRequestMethod().equals("HEAD")) {
				httpExchange.getResponseHeaders().set("Content-Length", "" + res.data.length);
				httpExchange.sendResponseHeaders(200, -1);
				return;
			} else {
				httpExchange.sendResponseHeaders(200, res.data.length);
				httpExchange.getResponseBody().write(res.data);
				httpExchange.getResponseBody().close();
			}
		} catch (Throwable t) {
			System.err.println("Error retrieving: " + path);
			t.printStackTrace();
			httpExchange.sendResponseHeaders(500, -1);
		}
	}

	private static void processFile(String path, File f, boolean gzip) throws IOException {
		if (!f.isDirectory()) {
			data.put(path + f.getName(), new Asset(readResource(new FileInputStream(f), gzip)));
		} else {
			for (File sub : f.listFiles()) {
				processFile(path + f.getName() + "/", sub, gzip);
			}
		}
	}

	private static byte[] readResource(InputStream in, boolean gzip) throws IOException {
		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		OutputStream gout = gzip ? new GZIPOutputStream(bout) : new DataOutputStream(bout);
		byte[] tmp = new byte[4096];
		int r;
		while ((r = in.read(tmp)) >= 0)
			gout.write(tmp, 0, r);
		gout.flush();
		gout.close();
		in.close();
		return bout.toByteArray();
	}

}