package com.basicsinjava.blogspot.Pagination.service;

import com.basicsinjava.blogspot.Pagination.entity.User;
import com.basicsinjava.blogspot.Pagination.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component
public class DataLoader {

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void loadData() throws IOException {
        URL url = new URL("https://randomuser.me/api/?results=500");
        String json = IOUtils.toString(url, Charset.forName("UTF-8"));
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(json);
        List<JsonNode> results = StreamSupport.stream(rootNode.get("results").spliterator(), false)
                .collect(Collectors.toList());

        List<User> users = results.stream().map(node -> {
            User user = new User();
            user.setFirstName(node.get("name").get("first").asText());
            user.setLastName(node.get("name").get("last").asText());
            user.setGender(node.get("gender").asText());
            user.setAge(node.get("dob").get("age").asInt());
            user.setEmail(node.get("email").asText());
            user.setPictureUrl(node.get("picture").get("large").asText());
            return user;
        }).collect(Collectors.toList());
        userRepository.saveAll(users);
    }
}