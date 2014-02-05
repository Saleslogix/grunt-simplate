grunt-contrib-nls-copy
======================
Pre-compile your simplate templates. amd option is optional and takes a module identifier if supplied.


Example Gruntfile.js:
```
module.exports = function(grunt) { 
    grunt.initConfig({
        simplate: {
          src: ['src/**/*.js'],
          options: {
            output: 'compiled/templates.js',
            amd: 'compiled/templates'
          }
        }
    });
    
    grunt.loadNpmTasks('grunt-simplate');
};
```

Example of package.json: 
```
{
  "name": "argos-saleslogix",
  "version": "8.1.0",
  "devDependencies": {
    "grunt": "~0.4.0",
    "grunt-simplate": "https://github.com/Saleslogix/grunt-simplate/tarball/master"
  }
}
```

## History

0.1.0
 * Initial checkin
