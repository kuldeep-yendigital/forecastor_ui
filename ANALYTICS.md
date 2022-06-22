# Analytics

## Overview

Analytics is provided through Google Tag Manager and Google Analytics.

Most of the heavy lifting is done through the `AnalyticsStore` and the
`AnalyticsService` encapsulates the integration with Google Tag Manager.

Generally analytics is based around events, i.e. things of interest that
happen. Google Tag Manager provides the ability to massage the raw events
from the app into something that is useful to the business in Google Analytics.
Generally if it is interesting announce a global event and have the
`AnalyticsStore` listen out for it.

The exception to this rule is when the event will cause the browser to leave
the SPA. In this case use the `AnalyticsService` directly providing a callback
to trigger the action after it has been logged by analytics.

Once the application is logging the event, administrators of the Google Tag
Manager account can set up triggers, tags and variables to capture information
and send it to Google Analytics.

The Google Tag Manager Container ID is provided through the environment config
files:

```
config/${env}.json
```

These IDs are baked into the static HTML page hosted on S3.

## Auth0

Currently Auth0 does not support Google Tag Manager, but does support Google
Analytics direct integration. The Google Analytics Tracking ID needs to be
provided to the hosted page in Auth0 per environment.

```
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-XXXXXXXXX-X', 'auto');
ga('send', 'pageview');
</script>
<script>
window.auth0AnalyticsOptions = {
  'google-analytics': {
    // This should be set to true in subsequent versions of auth0 analytics.
    // https://github.com/auth0/auth0-tag-manager/pull/8/files
    preloaded: false
  }
}
</script>
<script src="https://cdn.auth0.com/js/lock/10.18/lock.min.js"></script>
<script src="https://cdn.auth0.com/js/analytics/1.3.0/analytics.min.js"></script>
```

When [Auth0 analytics supports Google Tag Manager][auth0-gtm] we should replace
the above snippet with the following allowing control of event ingest through
Tag Manager:

```
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
<script>
<script>
window.auth0AnalyticsOptions = {
  'google-tag-manager': {
    preloaded: true
  }
}
</script>
<script src="https://cdn.auth0.com/js/lock/10.18/lock.min.js"></script>
<script src="https://cdn.auth0.com/js/analytics/1.3.0/analytics.min.js"></script>
```

[auth0-gtm]: https://github.com/auth0/auth0-tag-manager/pull/11
