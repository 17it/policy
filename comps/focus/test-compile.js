var compile = require('../../lib/compile');
var render = compile('./focus.html');

var res = render({
	blankLi: '<li></li>',
	focusList: [
		{img: 'img...', tagUrl: 'tagUrl...'},
		{img: 'img2...', url: 'url...'}
	]
});
console.log(res);

//var compileSrc = compile.compileSrc;
//console.log(compileSrc('<?echo "xx"; x.echo 1; $echo 2; xecho 3;?>').toString());
//console.log(compileSrc('<?echo4 4; echo$5 5; echo.x 6; echo 7; echo;?>').toString());
