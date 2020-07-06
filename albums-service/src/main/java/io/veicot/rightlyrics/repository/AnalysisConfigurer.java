package io.veicot.rightlyrics.repository;

import org.hibernate.search.backend.elasticsearch.analysis.ElasticsearchAnalysisConfigurationContext;
import org.hibernate.search.backend.elasticsearch.analysis.ElasticsearchAnalysisConfigurer;

public class AnalysisConfigurer implements ElasticsearchAnalysisConfigurer {

    @Override
    public void configure(ElasticsearchAnalysisConfigurationContext context) {
        context.analyzer("name").custom().tokenizer("standard").tokenFilters("asciifolding", "lowercase");

        context.analyzer("whitespace").custom().tokenizer("whitespace").tokenFilters("asciifolding", "lowercase");

        context.normalizer("sort").custom().tokenFilters("asciifolding", "lowercase");
    }
}