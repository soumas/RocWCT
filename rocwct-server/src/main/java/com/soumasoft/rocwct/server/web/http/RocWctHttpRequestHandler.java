package com.soumasoft.rocwct.server.web.http;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;

import com.soumasoft.rocwct.server.config.Properties;

import lombok.extern.log4j.Log4j2;

/**
 * The <code>RocWctHttpRequestHandler</code> is responsible for handling
 * a single HTTP request and returning static content to the webclient.
 * 
 * @author Thomas Juen, SoumaSoft
 *
 */
@Log4j2
public class RocWctHttpRequestHandler implements Runnable{ 
		
	/**
	 * Regex to get method and url from first row of http header
	 * e.g. 'GET http://localhost/index.html HTTP/1.1'
	 */
	private static final Pattern HTTP_FST_ROW_REGEX = Pattern.compile("(?<method>[^ ]+) (?<filepath>[^ ?]+).*");	
	/**
	 * The cache for static content
	 */
	private static final ConcurrentHashMap<String, byte[]> staticFileDataCache = new ConcurrentHashMap<String,byte[]>();
	/**
	 * Name of virtual filelist (json)
	 */
	private static final String VIRTUAL_COMPONENTS_FILLIST_PATH = "rocrail-wcp-components.json";
	
	
	private Socket request;
	
	public RocWctHttpRequestHandler(Socket request) {
		this.request = request;
	}

	/**
	 * Handles the request
	 */
	@Override
	public void run() {
		
		BufferedReader requestReader = null; 
		PrintWriter responseHeader = null; 
		BufferedOutputStream responseData = null;
		String filepath = null;
		
		try {
			
			log.debug("Request received - starting the handling of the request");
			
			requestReader = new BufferedReader(new InputStreamReader(request.getInputStream()));

			String firstHttpLine = requestReader.readLine();
			if(StringUtils.isBlank(firstHttpLine)) {
				log.debug("Request is empty - nothing to do for me. Bye!");
				return;
			}
			
			log.debug(firstHttpLine);
			Matcher m = HTTP_FST_ROW_REGEX.matcher(firstHttpLine);
			if(!m.matches()) {
				throw new RuntimeException(String.format("Unable to parse http method and path from first line ('%s')", firstHttpLine));
			}
			
			String method = m.group("method").toUpperCase();
			filepath = m.group("filepath");

			// RocWCT http server only handles static GET requests and -
			// if the browser wants it - the naked HEAD for a static file.
			if (method.equals("GET") || method.equals("HEAD")) {				

				// default file (index.html if not changed in properties)
				if (filepath.endsWith("/")) {
					filepath += Properties.getRocWctHttpDefaultPage();
				}
				
				// special request for rocrail-wcp-components.json builds a virtual json file
				// containing a list of all existing js-files within the subdirecotry "components".				
				if (filepath.endsWith(VIRTUAL_COMPONENTS_FILLIST_PATH)) {
					
					byte[] data;
					if(staticFileDataCache.containsKey(VIRTUAL_COMPONENTS_FILLIST_PATH)) {
						data = staticFileDataCache.get(VIRTUAL_COMPONENTS_FILLIST_PATH);
					} else {
						String pathToWebComponentJsFiles = Properties.getRocWctHttpDocumentsRoot() + "/js/webcomponents/";
						String[] fileNames = new File(pathToWebComponentJsFiles).list(new FilenameFilter() {
							@Override
							public boolean accept(File dir, String name) {
								return name.endsWith(".js");
							}
						});
						data = new JSONArray(fileNames).toString().getBytes("UTF-8");
						putStaticFileDataIfCacheEnabled(VIRTUAL_COMPONENTS_FILLIST_PATH, data);
					}
					
					responseHeader = prepareResponseHeader("200 OK", getContentType(filepath), (int)data.length);
					responseHeader.flush();
					
					responseData = new BufferedOutputStream(request.getOutputStream());
					responseData.write(data, 0, data.length);
					responseData.flush();
										
				} else {
				
					File file = new File(Properties.getRocWctHttpDocumentsRoot(), filepath);
					if(!file.exists()) {
						String msg = String.format("File not found ('%s')", filepath);
						log.warn(msg);
						responseHeader = prepareResponseHeader("404 Not Found", "text/plain", msg.length());
						responseHeader.println(msg);
						responseHeader.flush();
						return;
					}
					
					// write header (for GET and HEAD method)
					responseHeader = prepareResponseHeader("200 OK", getContentType(filepath), (int)file.length());
					responseHeader.flush();
					
					if(method.equals("GET")) {
						// append real data for GET request
						byte[] fileData = getStaticFileData(file);					
						responseData = new BufferedOutputStream(request.getOutputStream());
						responseData.write(fileData, 0, fileData.length);
						responseData.flush();
					}		
				}
				
			} else {
				throw new RuntimeException("Method not supported!");
			}
			
		} catch (Exception ex) {			
			
			String errmsg = String.format("Error on handling request ('%s'): %s",filepath, ex.getMessage());	
			log.error(errmsg, ex);

			// try to tell the browser, that something went wrong
			PrintWriter pw = null;
			try {
				pw = prepareResponseHeader("500 Internal Server Error", "text/plain", errmsg.length());
				pw.println(errmsg);
				pw.flush();
			} catch (IOException e) {
				log.error("Error on sending response to client!");
			} finally {
				close(pw);
			}
			
		} finally {
			close(requestReader);
			close(responseHeader);
			close(responseData);
			close(request);	
		}		
	}
	
	/**
	 * This method returns the content of the specified <code>file</code>
	 * as byte array. The content is cached after the first acces if
	 * the cache is not disabled (<code>Properties.rocWctHttpCache</code>).
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 */
	private byte[] getStaticFileData(File file) throws IOException {	
		
		String key = file.getPath();			
		if(staticFileDataCache.containsKey(key))
		{
			return staticFileDataCache.get(file.getPath());
		}
		
		byte[] data = readFileData(file);
		putStaticFileDataIfCacheEnabled(key,data);
		return data;		
	}
	
	private void putStaticFileDataIfCacheEnabled(String key, byte[] data) {
		if(Properties.getRocWctHttpCache()) {
			staticFileDataCache.putIfAbsent(key, data);
		}
	}

	/**
	 * Writes header-data into the outputstream of the request.
	 * 
	 * @param status
	 * @param contenttype
	 * @param contentlength
	 * @return
	 * @throws IOException
	 */
	private PrintWriter prepareResponseHeader(String status, String contenttype, int contentlength) throws IOException {
		PrintWriter header = new PrintWriter(request.getOutputStream());
		header.println(String.format("HTTP/1.1 %s", status));
		header.println("Server: RocWCT HTTP server");
		header.println("Date: " + new Date());
		header.println(String.format("Content-type: %s", contenttype));
		header.println("Content-length: "+ contentlength);
		header.println(); 
		return header;
	}
	
	/**
	 * Trys to close a resource if it is not null
	 * @param resource
	 */
	private void close(Closeable resource) {		
		if(resource == null) {
			return;
		}		
		try {
			resource.close();
		} catch (IOException e) {
			log.error(String.format("Error on closing resource %s", resource.getClass().getCanonicalName()),e);
		}
	}

	/**
	 * Reads the content of the specified  
	 * <code>file</code> into a byte array.
	 * @param file
	 * @return
	 * @throws IOException
	 */
	private byte[] readFileData(File file) throws IOException {
		FileInputStream fileIn = null;
		byte[] fileData = new byte[(int)file.length()];		
		try {
			fileIn = new FileInputStream(file);
			fileIn.read(fileData);
		} finally {
			if (fileIn != null)  {
				fileIn.close();				
			}
		}		
		return fileData;
	}
	
	/**
	 * Returns the content type for the specified <code>filepath</code>
	 * or 'text/plain' if content type is unknown.
	 * @param filepath
	 * @return
	 */
	private String getContentType(String filepath) {
		
		String flLower =  filepath.toLowerCase();
		
		if (flLower.endsWith(".htm")  
				||  flLower.endsWith(".html")) {
			return "text/html";			
		} else if (flLower.endsWith(".jpeg")  
				||  flLower.endsWith(".jpg")) {
			return "image/jpeg";			
		} else if(flLower.endsWith(".css")) {
			return "text/css";
		} else if(flLower.endsWith(".js")) {
			return "text/javascript";
		} else if(flLower.endsWith(".json")) {
			return "application/json";
		} else if(flLower.endsWith(".svg")) {
			return "image/svg+xml";
		} else if(flLower.endsWith(".png")) {
			return "image/png";
		} else if(flLower.endsWith(".gif")) {
			return "image/gif";
		} else if(flLower.endsWith(".ico")) {
			return "image/vnd.microsoft.icon";
		} else if(flLower.endsWith(".woff2")) {
			return "font/woff2";
		} else if(flLower.endsWith(".woff")) {
			return "font/woff";
		} else {			
			return "text/plain";
		}		
	}
}