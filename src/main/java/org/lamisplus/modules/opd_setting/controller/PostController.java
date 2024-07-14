package org.lamisplus.modules.opd_setting.controller;

import org.lamisplus.modules.opd_setting.domain.dto.PostDto;
import org.lamisplus.modules.opd_setting.domain.entity.Post;
import org.lamisplus.modules.opd_setting.service.PostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/v1/opd-setting")
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPost() {
        return postService.getAllPost();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Post createPost(@RequestBody PostDto postDTO) {
        return postService.createPost(postDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody PostDto postDTO) {
        Post updatedPost = postService.updatePost(id, postDTO);
        if (updatedPost != null) {
            return ResponseEntity.ok(updatedPost);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}


