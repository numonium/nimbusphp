<?php

#namespace UglifyPHP;

class Uglify_CSS extends Uglify
{
    protected static $location = 'uglifycss';
    protected static $exists_check = '';
    protected static $options = array('max-line-len', 'expand-vars', 'ugly-comments', 'cute-comments');
    protected static $option_place = 'before';
}