<div class="o-article__meta">
    Published
    @if ($author !== false)
        by <span itemprop="author" itemscope itemtype="http://schema.org/Person"><a class="author" href="https://twitter.com/lukasoppermann" itemprop="url" title="about {!!$author!!}" rel="author"><span itemprop="name">{!!$author!!}</span></a></span> / <a itemprop="publisher" itemtype="organization" href="http://vea.re"><span itemtype="name">vea.re</span></span>,
    @endif
    <time class="article_time" itemprop="datePublished" datetime="{{$machine_date}}">{!!$date!!}</time> •
    <time datetime="{!!$readingTime!!}m">{!!$readingTime!!} min read</time>
</div>
