
package org.lamisplus.modules.opd_setting.service;
import org.lamisplus.modules.opd_setting.domain.dto.PostDto;
import org.lamisplus.modules.opd_setting.domain.entity.Post;
import org.lamisplus.modules.opd_setting.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
    @Service
    public class PostService {
        @Autowired
        private PostRepository postRepository;

        public List<Post> getAllPost() {
            return postRepository.findAll();
        }

        public Optional<Post> getPostById(Long id) {
            return postRepository.findById(id);
        }

        public Post createPost(PostDto postDTO) {
            Post post = new Post();
            post.setFacilityId(postDTO.getFacilityId());
            post.setModuleServiceName(postDTO.getModuleServiceName());
            post.setModuleServiceCode(postDTO.getModuleServiceName().concat("_code"));
            post.setEncounterType(postDTO.getEncounterType());
            return postRepository.save(post);
        }

        public Post updatePost(Long id, PostDto postDTO) {
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                post.setFacilityId(postDTO.getFacilityId());
                post.setModuleServiceName(postDTO.getModuleServiceName());
                post.setModuleServiceCode(postDTO.getModuleServiceCode());
                post.setEncounterType(postDTO.getEncounterType());
                return postRepository.save(post);
            }
            return null;
        }

        public void deletePost(Long id) {
            postRepository.deleteById(id);
        }
    }
