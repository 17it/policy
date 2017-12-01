var script   = document.createElement('script');
script.type  = 'text/javascript';
script.onload = function() {
  PGWidgets.renderAskAnExpert('ask-an-expert-widget');

  PGWidgets.styles.onload = function() {
    PGWidgets.renderExitSurvey('exit-survey-widget');
  }
};
script.src = 'app.js'/*tpa=https://d3q4uqwa19hmv1.cloudfront.net/widgets/600cdacdc77b2cb86e8665a55f81a3854fb8f23c/app.js*/;
script.async = false;
document.head.appendChild(script);

var parentNode = document.getElementById('ask-an-expert-widget')

if (parentNode) {
  parentNode.setAttribute('data-user-email-provided', 'false');
  parentNode.setAttribute('data-user-subscribed', '');
}
