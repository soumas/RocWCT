package com.soumasoft.rocwct.server.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import com.soumasoft.rocwct.server.Main;

/**
 * Some utils used for install progress
 * 
 * @author Thomas Juen, SoumaSoft
 */
//don't use Log4j --> log4j2.xml may not exist 
public class InstallHelper {

	public void install() throws IOException {

		unzipHttpDocs();
		copyFromResourceIfNotExists("/log4j2.xml");
		copyFromResourceIfNotExists("/rocwct.properties");
		
		System.out.println("Installation/Update finished - have fun :)");
	}

	/**
	 * copies the template file from jar (resource) to the rootfolder
	 * of the application (specified by the Main classloader)
	 *  
	 * @param file
	 * @throws IOException
	 */
	private void copyFromResourceIfNotExists(String filename) throws IOException {
		File file = new File(getBasePathForClass()+filename);
		if (!file.exists()) {
			InputStream is = null;
			try {
				System.out.format("Copy file: %s", filename);
				is = getClass().getResourceAsStream(filename);
				Files.copy(is, file.toPath());
			} finally {
				if (is != null) {
					is.close();
				}
			}
		} else {
			System.out.format("skip file %s (exists)", filename);
		}
		System.out.println("");
	}

	/**
	 * method unzips all files from httpdocs.zip to the rootfolder
	 * of the application (specified by the Main classloader)
	 * 
	 * @throws IOException
	 */
	private void unzipHttpDocs() throws IOException {

		InputStream is = getClass().getResourceAsStream("/httpdocs.zip");
		ZipInputStream zis = new ZipInputStream(is);
		ZipEntry entry;
		byte[] buffer = new byte[2048];

		while ((entry = zis.getNextEntry()) != null) {

			File file = Paths.get(getBasePathForClass()).resolve(entry.getName()).toFile();

			System.out.format("copy file: %s", file.getAbsolutePath());
			System.out.println("");

			if(!file.getAbsolutePath().contains(".")) {
				file.mkdirs();
			} else {				
				file.getParentFile().mkdirs();				
				file.createNewFile();
				try (FileOutputStream fos = new FileOutputStream(file);
						BufferedOutputStream bos = new BufferedOutputStream(fos, buffer.length)) {

					int len;
					while ((len = zis.read(buffer)) > 0) {
						bos.write(buffer, 0, len);
					}
				}
			}
		}

	}

	/**
	 * Thanks to GOXR3PLUS Stackoverflow for following lines of code. Returns the
	 * absolute path of the current directory in which the given class file is.
	 * 
	 * @param classs
	 * @return The absolute path of the current directory in which the class file is.
	 * @author GOXR3PLUS[StackOverFlow user] + bachden [StackOverFlow user]
	 */
	public static final String getBasePathForClass() {

		// Local variables
		File file;
		String basePath = "";
		boolean failed = false;

		// Let's give a first try
		try {
			file = new File(Main.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath());

			if (file.isFile() || file.getPath().endsWith(".jar") || file.getPath().endsWith(".zip")) {
				basePath = file.getParent();
			} else {
				basePath = file.getPath();
			}
		} catch (URISyntaxException ex) {
			failed = true;
			System.out.println("ERROR! Cannot firgue out base path for class with way 1");
		}

		// The above failed?
		if (failed) {
			try {
				file = new File(Main.class.getClassLoader().getResource("").toURI().getPath());
				basePath = file.getAbsolutePath();
			} catch (URISyntaxException ex) {
				System.out.println("ERROR! Cannot firgue out base path for class with way 2");
			}
		}

		// fix to run inside eclipse
		if (basePath.endsWith(File.separator + "lib") || basePath.endsWith(File.separator + "bin")
				|| basePath.endsWith("bin" + File.separator) || basePath.endsWith("lib" + File.separator)) {
			basePath = basePath.substring(0, basePath.length() - 4);
		}
		// fix to run inside netbeans
		if (basePath.endsWith(File.separator + "build" + File.separator + "classes")) {
			basePath = basePath.substring(0, basePath.length() - 14);
		}
		// end fix
		if (!basePath.endsWith(File.separator)) {
			basePath = basePath + File.separator;
		}
		return basePath;
	}
}
