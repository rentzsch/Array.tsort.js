jQuery.pkg({
    require: 'http://cloud.github.com/downloads/rentzsch/Array.tsort.js/Array.tsort-1.0d1.pkg.js',
    init: function(){
        test('tsort basic', function(){
            var result = Array.tsort([
                ['foundation','framing'],
                ['framing','plumbing'],
                ['framing','windows'],
                ['framing','doors'],
                ['framing','trusses'],
                ['trusses','roofing']
            ]);
            equals(result.length, 7);
            equals(result[0], 'foundation');
            equals(result[1], 'framing');
            ok(array_contains(result.slice(2,6), 'plumbing'));
            ok(array_contains(result.slice(2,6), 'windows'));
            ok(array_contains(result.slice(2,6), 'doors'));
            ok(array_contains(result.slice(2,6), 'trusses'));
            equals(result[6], 'roofing');
        });
        test('tsort multiparent', function(){
            var result = Array.tsort([
                ['introspectFunction','extend'],
                ['introspectFunction','assert'],
                ['type_of','assert'],
                ['type_of','assertArgs'],
                ['jQuery','assertArgs']
            ]);
            
            if (false) {
                console.log('1 '+result.join(' '));
                console.log('2 '+result.slice(0,3).join(' '));
                console.log('3 '+result.slice(3).join(' '));
            }
            
            equals(result.length, 6);
            
            ok(array_contains(result.slice(0,3), 'introspectFunction'));
            ok(array_contains(result.slice(0,3), 'type_of'));
            ok(array_contains(result.slice(0,3), 'jQuery'));
            
            ok(array_contains(result.slice(3), 'extend'));
            ok(array_contains(result.slice(3), 'assert'));
            ok(array_contains(result.slice(3), 'assertArgs'));
        });
        test('tsort circular', function(){
            doubt(function(){
                Array.tsort([
                    ['truth','beauty'],
                    ['beauty','truth']
                ]);
            },/circular dependancy/, 'detect basic circular dependancy');
            
            doubt(function(){
                Array.tsort([
                    ['root', 'truth'],
                    ['truth','beauty'],
                    ['beauty','truth']
                ]);
            },/circular dependancy/, 'detect one-level-deep circular dependancy');
        });
        test('tsort redundant', function(){
            var result = Array.tsort([
                ['foundation','framing'],
                ['foundation','framing'],
                ['framing','plumbing'],
                ['framing','plumbing'],
                ['framing','windows'],
                ['framing','windows'],
                ['framing','doors'],
                ['framing','doors'],
                ['framing','trusses'],
                ['framing','trusses'],
                ['trusses','roofing'],
                ['trusses','roofing']
            ]);
            equals(result.length, 7);
            equals(result[0], 'foundation');
            equals(result[1], 'framing');
            ok(array_contains(result.slice(2,6), 'plumbing'));
            ok(array_contains(result.slice(2,6), 'windows'));
            ok(array_contains(result.slice(2,6), 'doors'));
            ok(array_contains(result.slice(2,6), 'trusses'));
            equals(result[6], 'roofing');
        });
    }
});

function array_contains(array, element) {
    var index = 0;
    for (; index < array.length; index++) {
        if (array[index] === element) {
            return true;
        }
    }
    return false;
}