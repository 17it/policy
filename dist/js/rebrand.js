(function() {
  var paramString = window.location.href.split('?')[1];

  function addFonts() {
    var link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = 'https://branding.policygenius.com/fonts/PolicyGenius/font.css';

    console.log('Font File:', link.src);
    document.head.appendChild(link);
  }

  function addCss(string, link) {
    var $cssLink = document.querySelectorAll(`[href*="${string}"]`)[0];
    if (!$cssLink) { return; }
    var originalHref = $cssLink.href;
    var rebrandLink = link;

    console.log('CSS File:', rebrandLink);
    $cssLink.setAttribute('href', rebrandLink);
  }

  if(paramString && paramString.indexOf('rebrand') >= 0) {
    console.log('Switching to rebrand...');
    addFonts();
    addCss('application.css', 'https://s3-us-west-2.amazonaws.com/styles-pg/rebrand/styles/application.css');
    addCss('phantasm', 'https://s3-us-west-2.amazonaws.com/styles-pg/rebrand/phantasm/phantasm.css');
  }
})();
