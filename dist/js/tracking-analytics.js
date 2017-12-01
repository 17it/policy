!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.0.1";
  dataLayer = [{}];

  var traits = {"age":0,"assets":0,"children":[],"created_at":"2017-11-29T09:38:59.350Z","debt":0,"family_size":1,"household_income":0,"income":0,"initial_channel_grouping":"Direct","initial_referred_to_url":"https://www.policygenius.com/","initial_referrer":"","initial_utm_medium":"(none)","initial_utm_source":"(direct)","number_of_children":0,"uuid":"741910713619cc7548f4022db6631e0a","feature_product_navbar_open":true,"feature_health_sherpa":true,"feature_health_sherpa_online_enroll":false,"feature_workflow_client_messages":false,"feature_workflow_agent_messages":true,"feature_job_title_with_elastic_search":true,"feature_deprecate_client_reply_processor":true,"feature_protection_promise":false,"feature_iterable_webhook_flow":false,"feature_styleguide_latest":false,"feature_deploy_artifacts_latest":false,"feature_investigate_saved_quotes":true,"feature_sync_internal_case_with_zendesk":false,"feature_athenaeum_main_navigation":true,"feature_track_unmasked_email":false,"feature_life_3_flow":false,"feature_rebrand_life_2_flow":true};
  traits['content_group'] = (function(c) {
    for (var b = document.getElementsByTagName("meta"), a = 0; a < b.length; a++) {
      if (c == b[a].name || c == b[a].getAttribute("property")) { return b[a].content; }
    }
  }("contentGroup"));

  analytics.load("ZqiLH0I4wnOWluryFLyGavNeZf01V2uO");
  analytics.identify("741910713619cc7548f4022db6631e0a", traits, {"Mixpanel":false,"Zopim":false});
  analytics.page(null, "/tracking-analytics.js", {"url":"https://www.policygenius.com/tracking-analytics.js","path":"/tracking-analytics.js"});
  

  analytics.ready(function() {
    false && !$zopim.livechat.getName().length && $zopim.livechat.setName(null);
    false && $zopim.livechat.setEmail(null);
    window._fbq.disablePushState = false;
    window._fbq.allowDuplicatePageViews = true;
  });
}}();

var optimizely=window.optimizely=window.optimizely||[];
window.optimizely.push(['activate']);optimizely.push(['setDimensionValue', "channelGrouping", "Direct"]);