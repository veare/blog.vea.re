<!DOCTYPE html>
<html>
    <head>
        <title>{{$title or 'Web Development, User Experience & Design'}} – veare field notes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1,maximum-scale=1">
        <link href='{{asset(env("CSS_PATH").'app.min.css')}}' rel='stylesheet' type='text/css'>
        <link href='{{asset(env("CSS_PATH").'prism.css')}}' rel="stylesheet" />
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-7074034-1', 'auto');
          ga('send', 'pageview');
          ga('set', 'anonymizeIp', true);
        </script>
    </head>
    <body>
        <div class="o-container">
            @yield('content')
        </div>
    <script src='{{asset(env("JS_PATH").'/prism.js')}}'></script
    </body>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>
    <script>
      function ready(fn) {
          if (document.readyState != 'loading'){
            fn();
          } else {
            document.addEventListener('DOMContentLoaded', fn);
          }
      }
      ready(function(){
          WebFont.load({
            google: {
              families: ['Lato:400,700']
            }
        })
      });
    </script>
</html>
