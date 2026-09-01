source "https://rubygems.org"
#
#     bundle exec jekyll serve
#
gem "jekyll", "~> 4.4"
gem "csv"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag", "~> 2.7"
  gem "jekyll-sitemap"
end

# Windows ve JRuby zoneinfo
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Windows izleme performansı
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
