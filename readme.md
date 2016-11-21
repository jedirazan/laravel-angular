# Laravel 5.3 + Angular 2.2

This is a quickstart for Laravel 5.3 and Angular 2.2 setup.

To begin, clone this repo to your local machine.

### Install dependencies

In your terminal, run these commands  
>> `composer install`
>> `npm install`

Go to `/node_modules/elixir-typescript/index.js`, find and comment this line:  
>> `// .pipe($.concat(paths.output.name))`

### Run app

In your terminal, run  
>> `gulp`  
This will compile all your assets, including Angular part.  

Then, run  
>> `php artisan serve`

#### Laravel Documentation

[Laravel website](http://laravel.com/docs).

#### Angular Documentation

[Angular website](https://angular.io/docs/ts/latest).