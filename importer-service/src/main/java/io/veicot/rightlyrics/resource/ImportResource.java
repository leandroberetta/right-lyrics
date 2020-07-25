package io.veicot.rightlyrics.resource;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.veicot.rightlyrics.resource.response.Response;
import io.veicot.rightlyrics.load.LyricsLoader;

@ApplicationScoped
@Path("/api/import")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ImportResource {

    private Logger logger = LoggerFactory.getLogger(ImportResource.class);

    @Inject
    LyricsLoader lyricsLoader;

    @POST
    @Path("/upload")
    @Consumes("multipart/form-data")
    public Response<String> processFile(MultipartFormDataInput input) {
        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("uploadedFile");
        Response<String> response = new Response<>();

        for (InputPart inputPart : inputParts) {
            try {
                InputStream inputStream = inputPart.getBody(InputStream.class, null);
                String data = new String(IOUtils.toByteArray(inputStream));              
                
                lyricsLoader.load(data);

                response.setStatus(0);
                response.setData("OK");

            } catch (IOException e) {
                e.printStackTrace();

                response.setStatus(-1);
                response.setData("Error");
            }
        }

        return response;
    }
}
