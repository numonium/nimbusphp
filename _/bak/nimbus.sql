-- phpMyAdmin SQL Dump
-- version 4.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 20, 2015 at 02:14 PM
-- Server version: 5.6.24
-- PHP Version: 5.5.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `nimbus`
--
CREATE DATABASE IF NOT EXISTS `nimbus` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `nimbus`;

-- --------------------------------------------------------

--
-- Table structure for table `301s`
--

CREATE TABLE IF NOT EXISTS `301s` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `url-old` text NOT NULL,
  `url-from` text NOT NULL,
  `url-to` text NOT NULL,
  `link-type` text,
  `link-id` int(11) DEFAULT NULL,
  `link-uuid` int(11) DEFAULT NULL,
  `active` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE IF NOT EXISTS `cache` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) NOT NULL DEFAULT '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3',
  `hash` text NOT NULL,
  `data` text NOT NULL,
  `date-mod` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `content_attachment-meta`
--

CREATE TABLE IF NOT EXISTS `content_attachment-meta` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `content_attachment-id` int(11) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `val` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `content_attachment-meta-meta`
--

CREATE TABLE IF NOT EXISTS `content_attachment-meta-meta` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `content_attachment-type` text NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `content_attachments`
--

CREATE TABLE IF NOT EXISTS `content_attachments` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `company-id` int(11) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `type` text NOT NULL,
  `href` text NOT NULL,
  `path` text NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `content_types`
--

CREATE TABLE IF NOT EXISTS `content_types` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `mime` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `dirs`
--

CREATE TABLE IF NOT EXISTS `dirs` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `path` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `dirs`
--

INSERT INTO `dirs` (`id`, `uuid`, `site-id`, `name`, `slug`, `path`) VALUES
(1, 'Ud4N4wAtpOWYpYD6v7qYBjBszabqVk8hazEBXlzDyr4CGsAUP0LZXkGbcAdFGQM', 0, 'CSS', 'css', '/css'),
(2, 'slTA2JIGXlSpTfWJ4Jx0skeqNHxZdvNXeAAcGTjvwKqFgnLWVmvaJLJMS7o5kdr', 0, 'JS', 'js', '/js'),
(3, '50Mkf3ZSgYD4mMQKdh9EzuHEt0CwFt2ak1NJu3Nz631Z6oP34Y7IuJTvpCXNUtm', 0, 'Administration', 'admin', '/_admin'),
(4, 'gjC8H4tPzhAlo2eI7mHBusjEOgK9o9fDzNF7DjotsS1JPKDH2R65kjayxgF99Wg', 0, 'Images', 'img', '/img');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) NOT NULL,
  `company-id` int(11) NOT NULL,
  `company-uuid` varchar(64) NOT NULL,
  `user-id` int(11) NOT NULL,
  `user-uuid` varchar(64) NOT NULL,
  `index` int(11) NOT NULL DEFAULT '-1',
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `data` text NOT NULL,
  `data_url` text NOT NULL,
  `size` double NOT NULL DEFAULT '0',
  `type` text NOT NULL,
  `path` text NOT NULL,
  `perms` int(11) NOT NULL DEFAULT '755',
  `locked` enum('0','1') NOT NULL DEFAULT '0',
  `hidden` enum('0','1') NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last-edited-user-id` int(11) NOT NULL,
  `last-edited-user-uuid` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE IF NOT EXISTS `forms` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `title` text NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `slug` text NOT NULL,
  `parent-id` int(11) DEFAULT NULL,
  `html-id` text NOT NULL,
  `html-name` text NOT NULL,
  `fields` text NOT NULL,
  `method` varchar(64) NOT NULL DEFAULT 'post',
  `action` text NOT NULL,
  `enctype` text NOT NULL,
  `events` text NOT NULL,
  `processor` text,
  `hidden` enum('0','1') NOT NULL DEFAULT '0',
  `fieldset` enum('0','1') NOT NULL DEFAULT '1',
  `validator` text NOT NULL,
  `site-id` int(11) NOT NULL DEFAULT '0',
  `site-uuid` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE IF NOT EXISTS `galleries` (
  `id` int(11) NOT NULL,
  `uuid` text NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) NOT NULL,
  `company-id` int(11) NOT NULL,
  `company-uuid` varchar(64) NOT NULL,
  `user-id` int(11) DEFAULT NULL,
  `user-uuid` varchar(64) DEFAULT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `type` text,
  `description` text,
  `dir` text NOT NULL,
  `dir-/` text NOT NULL,
  `dir-.` text NOT NULL,
  `dir-lg` text NOT NULL,
  `dir-thumb` text NOT NULL,
  `size-rows` int(11) NOT NULL DEFAULT '3',
  `size-cols` int(11) NOT NULL DEFAULT '3',
  `size-img_per_page` int(11) NOT NULL DEFAULT '9',
  `thumb-image-id` int(11) NOT NULL,
  `wrapper-tag` text,
  `html` text NOT NULL,
  `style` varchar(128) NOT NULL DEFAULT 'grid',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `galleries-images`
--

CREATE TABLE IF NOT EXISTS `galleries-images` (
  `gallery-id` int(11) NOT NULL,
  `gallery-uuid` varchar(64) NOT NULL,
  `image-id` int(11) NOT NULL,
  `image-uuid` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) NOT NULL,
  `parent-id` int(11) DEFAULT NULL,
  `parent-uuid` varchar(64) DEFAULT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `auth_level` varchar(64) NOT NULL,
  `hidden` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `uuid`, `site-id`, `site-uuid`, `parent-id`, `parent-uuid`, `name`, `slug`, `auth_level`, `hidden`) VALUES
(1, 'k0R0EfiBtrBtWBg5iZUSxZdWod0sHnXd4S0EIjilDj691XsAsgrKtESktp5RG6x', 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 0, '', 'Administrators', 'admin', '1', '0'),
(3, 'NTQze6cRHLTKEuUdDKMrTRjZEvNwpznxVoWwGrSfIJLGE2t1GiupdLpLyNcEXe9', 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', NULL, NULL, 'Users', 'user', '3', '0');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE IF NOT EXISTS `images` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `company-id` int(11) DEFAULT NULL,
  `company-uuid` varchar(64) NOT NULL,
  `site-id` int(11) DEFAULT NULL,
  `site-uuid` varchar(64) NOT NULL,
  `user-id` int(11) NOT NULL,
  `user-uuid` varchar(64) NOT NULL,
  `gallery-id` int(11) NOT NULL,
  `gallery-uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `href` text NOT NULL,
  `file` text NOT NULL,
  `type` text NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `caption` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `loc_cities`
--

CREATE TABLE IF NOT EXISTS `loc_cities` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `code` text NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `state_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM AUTO_INCREMENT=578 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `loc_cities`
--

INSERT INTO `loc_cities` (`id`, `name`, `code`, `lat`, `lng`, `state_id`, `country_id`) VALUES
(1, 'Oklahoma City', '73185', 35.551409, -97.407537, 1, 1),
(2, 'Ecleto', '78111', 28.944864, -97.882815, 2, 1),
(3, 'Grandfalls', '79742', 31.345856, -102.856778, 2, 1),
(4, 'Buffalo', '14212', 42.894553, -78.824458, 3, 1),
(5, 'Summerfield', '79085', 34.743735, -102.506442, 2, 1),
(6, 'Memphis', '38182', 35.201738, -89.971538, 4, 1),
(7, 'Miami', '33153', 25.865523, -80.193619, 5, 1),
(8, 'Fort Wingate', '87316', 35.519129, -108.486407, 6, 1),
(9, 'Richmond', '23282', 37.524246, -77.493157, 7, 1),
(10, 'Paterson', '07510', 41.011428, -74.304793, 8, 1),
(11, 'Newport', '37821', 35.954431, -83.202749, 4, 1),
(12, 'Chevak', '99563', 61.583982, -164.776457, 9, 1),
(13, 'Helena', '59604', 46.6672, -111.968877, 10, 1),
(14, 'Strang', '68444', 40.398105, -97.552132, 11, 1),
(15, 'Dupont', '80024', 39.844501, -104.918783, 12, 1),
(16, 'Little Rock', '72222', 34.751918, -92.392487, 13, 1),
(17, 'Atlanta', '30345', 33.851347, -84.286961, 14, 1),
(18, 'Concord', '94521', 37.957503, -121.974955, 15, 1),
(19, 'Birmingham', '35209', 33.465336, -86.808213, 16, 1),
(20, 'Darrouzett', '79024', 36.445302, -100.325415, 2, 1),
(21, 'Saxapahaw', '27340', 35.948814, -79.329664, 17, 1),
(22, 'Frankfort', '66427', 39.733313, -96.522272, 18, 1),
(23, 'Rochester', '05767', 43.880382, -72.815917, 19, 1),
(24, 'Portland', '97232', 45.528712, -122.63631, 20, 1),
(25, 'Pyote', '79777', 31.538694, -103.126666, 2, 1),
(26, 'Maineville', '45039', 39.316973, -84.243763, 21, 1),
(27, 'Kent', '97033', 45.083789, -120.664895, 20, 1),
(28, 'Blairstown', '07825', 40.967386, -74.965097, 8, 1),
(29, 'Killona', '70066', 29.9987754822, -90.4869499207, 22, 1),
(30, 'Monson', '04464', 45.298088, -69.487986, 23, 1),
(31, 'Steamboat Rock', '50672', 42.417841, -93.06291, 24, 1),
(32, 'South Haven', '49090', 42.404096, -86.254207, 25, 1),
(33, 'Cusseta', '31805', 32.299026, -84.764537, 14, 1),
(34, 'Yeagertown', '17099', 40.644505, -77.567708, 26, 1),
(35, 'Altair', '77412', 29.60466, -96.524899, 2, 1),
(36, 'Greenville', '32331', 34.8601, -82.2464, 5, 1),
(37, 'Moyie Springs', '83845', 48.746434, -116.179603, 27, 1),
(38, 'Norton', '67654', 39.840706, -99.887832, 18, 1),
(39, 'Knoxville', '31050', 35.883876, -84.120186, 14, 1),
(40, 'FPO', '34050', 41.0375215, -111.6789275, 28, 1),
(41, 'Beaver', '97108', 45.276746, -123.823417, 20, 1),
(42, 'San Jose', '95148', 37.3304, -121.7913, 15, 1),
(43, 'Klemme', '50449', 43.013643, -93.587944, 24, 1),
(44, 'Cairo', '45820', 40.830388, -84.085154, 21, 1),
(45, 'Centerville', '02634', 41.799312, -70.308662, 29, 1),
(46, 'Cobden', '62920', 37.542358, -89.245741, 30, 1),
(47, 'Sterling City', '76951', 31.835063, -101.001729, 2, 1),
(48, 'Seattle', '98191', 47.432251, -121.803388, 31, 1),
(49, 'Otwell', '47564', 38.466221, -87.098548, 32, 1),
(50, 'Rome', '30161', 34.250726, -85.146501, 14, 1),
(51, 'Coupland', '78615', 30.487161, -97.367571, 2, 1),
(52, 'Dunlevy', '15432', 40.115077, -79.862703, 26, 1),
(53, 'Young America', '46998', 40.866023, -86.225982, 32, 1),
(54, 'Willis', '48191', 42.129249, -83.568741, 25, 1),
(55, 'Boston', '02108', 42.357603, -71.068432, 29, 1),
(56, 'Newark', '07112', 40.71071, -74.213073, 8, 1),
(57, 'Ellington', '63638', 37.239797, -90.958851, 33, 1),
(58, 'Spokane', '99216', 47.663389, -117.219307, 31, 1),
(59, 'Smithville', '64089', 39.391739, -94.559239, 33, 1),
(60, 'Chagrin Falls', '44022', 41.449353, -81.431436, 21, 1),
(61, 'Vichy', '65580', 38.097958, -91.77875, 33, 1),
(62, 'Post Mills', '05058', 43.995961, -72.411393, 19, 1),
(63, 'Burlingame', '94011', 37.381144, -122.334825, 15, 1),
(64, 'Brandon', '39043', 32.269041, -89.987491, 34, 1),
(65, 'Bowring', '74009', 36.665794, -96.398424, 1, 1),
(66, 'Iron City', '31759', 30.994728, -84.796632, 14, 1),
(67, 'Littleton', '80120', 39.599426, -105.0044, 12, 1),
(68, 'Calumet', '15621', 40.360223, -79.439801, 26, 1),
(69, 'Fayetteville', '28312', 35.066291, -78.866574, 17, 1),
(70, 'Jefferson City', '65103', 38.530921, -92.249342, 33, 1),
(71, 'Bakersfield', '93386', 35.294405, -118.905173, 15, 1),
(72, 'Llano', '87543', 36.148617, -105.664751, 6, 1),
(73, 'Tulare', '57476', 44.730489, -98.553926, 35, 1),
(74, 'Waverly', '31565', 31.042672, -81.56967, 14, 1),
(75, 'Goodyear', '85395', 33.4811, -112.3545, 36, 1),
(76, 'Dallas', '26036', 39.978343, -80.550804, 37, 1),
(77, 'Washington', '20047', 38.893311, -77.014647, 38, 1),
(78, 'Duarte', '91010', 33.786594, -118.298662, 15, 1),
(79, 'Canton', '55922', 43.566687, -91.912957, 39, 1),
(80, 'Monticello', '87939', 33.042613, -107.170508, 6, 1),
(81, 'Bagley', '56621', 47.487024, -95.41334, 39, 1),
(82, 'May', '73851', 36.6225910187, -99.7857704163, 1, 1),
(83, 'Isabella', '37346', 35.027619, -84.355086, 4, 1),
(84, 'Green Valley Lake', '92341', 34.241137, -116.938548, 15, 1),
(85, 'Erie', '61250', 41.655958, -90.084264, 30, 1),
(86, 'Gabriels', '12939', 44.552725, -74.317958, 3, 1),
(87, 'Mims', '32754', 28.697383, -80.866278, 5, 1),
(88, 'Lagrange', '30261', 33.04567, -85.048995, 14, 1),
(89, 'Madison', '68748', 41.830786, -97.47195, 11, 1),
(90, 'Troy', '26443', 39.083881, -80.754921, 37, 1),
(91, 'Byron', '14422', 43.073794, -78.062912, 3, 1),
(92, 'Louisville', '40223', 38.265072, -85.558228, 40, 1),
(93, 'Plymouth', '02362', 41.970474, -70.701357, 29, 1),
(94, 'Arbovale', '24915', 38.454575, -79.793403, 37, 1),
(95, 'Whitehall', '59759', 45.877146, -112.124535, 10, 1),
(96, 'Tampa', '33610', 27.995125, -82.404584, 5, 1),
(97, 'Brookside', '35036', 33.63628, -86.916202, 16, 1),
(98, 'Fairbury', '68352', 40.148817, -97.183918, 11, 1),
(99, 'Saint Paul', '55106', 44.968384, -93.048817, 39, 1),
(100, 'Arlington', '81021', 38.40677, -103.369741, 12, 1),
(101, 'Mc Caysville', '30555', 34.936986, -84.403709, 14, 1),
(102, 'Bay Saint Louis', '39521', 30.403156, -89.49821, 34, 1),
(103, 'Chattaroy', '99003', 47.919178, -117.29209, 31, 1),
(104, 'Shawnee Mission', '66219', 38.955326, -94.779899, 18, 1),
(105, 'Lyndon Station', '53944', 43.689875, -89.891543, 41, 1),
(106, 'Albany', '56307', 45.615114, -94.574022, 39, 1),
(107, 'Kearny', '07032', 40.76466, -74.147108, 8, 1),
(108, 'Cranberry Twp', '16066', 40.709713, -80.104597, 26, 1),
(109, 'Rapid City', '49676', 44.844863, -85.294318, 25, 1),
(110, 'North Troy', '05859', 44.937769, -72.433354, 19, 1),
(111, 'Ontario Center', '14520', 43.348369, -77.045288, 3, 1),
(112, 'Arrington', '22922', 37.690183, -78.947944, 7, 1),
(113, 'Nacogdoches', '75962', 31.699494, -94.607432, 2, 1),
(114, 'Valley Stream', '11582', 40.754757, -73.601772, 3, 1),
(115, 'Kerrville', '78029', 30.033226, -99.140974, 2, 1),
(116, 'Irvine', '92604', 33.689885, -117.786783, 15, 1),
(117, 'Muscadine', '36269', 33.752913, -85.378907, 16, 1),
(118, 'Daytona Beach', '32126', 29.022729, -81.172169, 5, 1),
(119, 'Adams', '97810', 45.749678, -118.617582, 20, 1),
(120, 'Alsip', '60803', 41.811929, -87.68732, 30, 1),
(121, 'West Louisville', '42377', 37.745491, -87.112823, 40, 1),
(122, 'Tuscola', '61953', 39.799509, -88.281585, 30, 1),
(123, 'Cimarron', '67835', 37.812727, -100.343825, 18, 1),
(124, 'Glenfield', '58443', 47.456948, -98.691563, 42, 1),
(125, 'Brookville', '15825', 41.162735, -79.081609, 26, 1),
(126, 'Sacramento', '95828', 38.4826, -121.4006, 15, 1),
(127, 'Cincinnati', '52549', 40.634384, -92.921898, 24, 1),
(128, 'Carson', '51525', 41.225276, -95.368086, 24, 1),
(129, 'Marysville', '98270', 48.065639, -122.156168, 31, 1),
(130, 'Wood Dale', '60399', 41.954471, -87.937701, 30, 1),
(131, 'Kansas City', '66112', 39.115999, -94.764024, 18, 1),
(132, 'Mesquite', '89034', 36.809, -114.0591, 43, 1),
(133, 'Pratts', '22731', 38.428509, -78.267848, 7, 1),
(134, 'Whitman', '02382', 42.081603, -70.938127, 29, 1),
(135, 'White Hall', '21161', 39.66176, -76.566639, 44, 1),
(136, 'Humansville', '65674', 37.792282, -93.579531, 33, 1),
(137, 'Marlton', '08053', 39.884517, -74.90674, 8, 1),
(138, 'Hyder', '99923', 55.517921, -132.003244, 9, 1),
(139, 'Elkhart', '46516', 41.676333, -85.962137, 32, 1),
(140, 'Bill', '82631', 42.894249, -105.485243, 45, 1),
(141, 'Pleasant Mills', '46780', 40.74532, -84.937926, 32, 1),
(142, 'Jacksontown', '43030', 39.968846, -82.430017, 21, 1),
(143, 'Clarence', '16829', 41.058482, -77.931213, 26, 1),
(144, 'Mc Intosh', '32664', 29.437972, -82.229534, 5, 1),
(145, 'Laramie', '82072', 41.582018, -105.708717, 45, 1),
(146, 'Warren', '02885', 41.725618, -71.270165, 46, 1),
(147, 'Levittown', '19059', 40.328645, -75.10278, 26, 1),
(148, 'Hammonton', '08037', 39.563616, -74.711081, 8, 1),
(149, 'Bird In Hand', '17505', 40.056109, -76.183036, 26, 1),
(150, 'Hattiesburg', '39401', 31.314553, -89.306471, 34, 1),
(151, 'Fort Duchesne', '84026', 40.301411, -109.863726, 47, 1),
(152, 'Weston', '06883', 41.219499, -73.371474, 48, 1),
(153, 'Calverton', '22016', 38.631853, -77.670654, 7, 1),
(154, 'Brinklow', '20862', 39.183777, -77.016338, 44, 1),
(155, 'El Paso', '79907', 31.708908, -106.329281, 2, 1),
(156, 'Highlands', '77562', 29.829599, -95.039286, 2, 1),
(157, 'Coalville', '84017', 40.840518, -111.322754, 47, 1),
(158, 'Fairfax', '52228', 41.915304, -91.780102, 24, 1),
(159, 'Gilford', '48736', 43.49442, -83.624431, 25, 1),
(160, 'Dix', '62830', 38.43329, -88.965697, 30, 1),
(161, 'Big Flats', '14814', 42.145509, -76.952721, 3, 1),
(162, 'Malone', '32445', 30.960245, -85.163874, 5, 1),
(163, 'Oak Ridge', '16245', 40.847829, -79.451575, 26, 1),
(164, 'Grand Coulee', '99133', 47.938511, -118.997835, 31, 1),
(165, 'Andover', '03265', 43.417004, -71.99002, 49, 1),
(166, 'Nalcrest', '33856', 27.855686, -81.430915, 5, 1),
(167, 'Harbor View', '43434', 41.645699, -83.620233, 21, 1),
(168, 'Scotland', '06264', 41.695803, -72.087045, 48, 1),
(169, 'Clarkston', '99403', 46.394622, -117.064457, 31, 1),
(170, 'Owensboro', '42303', 37.755884, -87.080252, 40, 1),
(171, 'Willet', '13863', 42.452044, -75.901434, 3, 1),
(172, 'Coyote', '95013', 37.2123, -121.7416, 15, 1),
(173, 'Harrisburg', '17129', 40.261516, -76.880884, 26, 1),
(174, 'Cisne', '62823', 38.513774, -88.404524, 30, 1),
(175, 'Lexington', '40574', 38.028269, -84.471505, 40, 1),
(176, 'Pompano Beach', '33068', 26.216021, -80.22054, 5, 1),
(177, 'Greeley', '52050', 42.59389, -91.323316, 24, 1),
(178, 'Narvon', '17555', 40.125165, -75.975584, 26, 1),
(179, 'Flushing', '11353', 40.651378, -73.870779, 3, 1),
(180, 'Lawrence', '01840', 42.707958, -71.16381, 29, 1),
(181, 'Kenosha', '53144', 42.605788, -87.876171, 41, 1),
(182, 'Indianapolis', '46239', 39.726493, -86.000482, 32, 1),
(183, 'Mc Lean', '22109', 38.920165, -77.229043, 7, 1),
(184, 'Longview', '75615', 32.51121, -94.783493, 2, 1),
(185, 'Jersey Shore', '17740', 41.208518, -77.025687, 26, 1),
(186, 'Liberty', '12754', 41.79618, -74.748397, 3, 1),
(187, 'Sabin', '56580', 46.770257, -96.59852, 39, 1),
(188, 'Tulsa', '74136', 36.060548, -95.945178, 1, 1),
(189, 'Fairchild', '54741', 44.596253, -90.990568, 41, 1),
(190, 'Phoenix', '85025', 33.422621, -111.723635, 36, 1),
(191, 'Lafayette', '80026', 39.997964, -105.096346, 12, 1),
(192, 'East Stroudsburg', '18301', 41.036714, -75.173463, 26, 1),
(193, 'Brighton', '02135', 42.34779, -71.156599, 29, 1),
(194, 'Rineyville', '40162', 37.75249, -85.995395, 40, 1),
(195, 'Petros', '37845', 36.081406, -84.442969, 4, 1),
(196, 'Bettsville', '44815', 41.246929, -83.239806, 21, 1),
(197, 'La Plata', '87418', 36.957632, -108.179243, 6, 1),
(198, 'Kidder', '64649', 39.734774, -94.08478, 33, 1),
(199, 'Ragley', '70657', 30.470262, -93.233652, 22, 1),
(200, 'Florence', '54121', 45.902724, -88.228921, 41, 1),
(201, 'Muncie', '47306', 40.202293, -85.408221, 32, 1),
(202, 'Florissant', '63033', 38.794711, -90.283062, 33, 1),
(203, 'Ord', '68862', 41.596187, -98.941783, 11, 1),
(204, 'Evans', '30809', 33.541194, -82.139775, 14, 1),
(205, 'Solomon', '85551', 32.842769, -109.696449, 36, 1),
(206, 'Cliffside', '28024', 35.241615, -81.775456, 17, 1),
(207, 'York', '17403', 39.94943, -76.712998, 26, 1),
(208, 'Westerly', '02891', 41.369128, -71.812643, 46, 1),
(209, 'Days Creek', '97429', 42.981946, -123.14387, 20, 1),
(210, 'Chignik Lagoon', '99565', 58.268704, -156.648418, 9, 1),
(211, 'Glendale', '91201', 34.171606, -118.289892, 15, 1),
(212, 'Chattanooga', '37410', 35.001787, -85.313762, 4, 1),
(213, 'Clayton', '36016', 31.887413, -85.450932, 16, 1),
(214, 'Eckman', '24829', 37.375246, -81.653889, 37, 1),
(215, 'Floral Park', '11005', 40.757057, -73.7182, 3, 1),
(216, 'Mooringsport', '71060', 32.66258, -93.973018, 22, 1),
(217, 'Oxnard', '93034', 34.032383, -119.1343, 15, 1),
(218, 'Ermine', '41815', 37.140336, -82.814691, 40, 1),
(219, 'Elma', '14059', 42.834002, -78.634257, 3, 1),
(220, 'Tolu', '42084', 37.434913, -88.246148, 40, 1),
(221, 'Hannibal', '54439', 45.206757, -90.484132, 41, 1),
(222, 'Fountain Hills', '85269', 33.276539, -112.18717, 36, 1),
(223, 'Stamford', '06904', 41.308873, -73.363661, 48, 1),
(224, 'Ceredo', '25507', 38.384557, -82.557785, 37, 1),
(225, 'Bays', '41310', 37.640513, -83.244088, 40, 1),
(226, 'Chillicothe', '61523', 40.901349, -89.506793, 30, 1),
(227, 'New York', '10161', 40.780751, -73.977182, 3, 1),
(228, 'Pine Bluffs', '82082', 41.178799, -104.066591, 45, 1),
(229, 'Corpus Christi', '78476', 27.777, -97.463213, 2, 1),
(230, 'Royalton', '62983', 37.879033, -89.114149, 30, 1),
(231, 'Wichita', '67203', 37.704798, -97.363766, 18, 1),
(232, 'Schaumburg', '60196', 42.056376, -88.072522, 30, 1),
(233, 'Sierra Blanca', '79851', 31.193821, -105.321874, 2, 1),
(234, 'Edwardsville', '36261', 33.706595, -85.509902, 16, 1),
(235, 'Paskenta', '96074', 39.877198, -122.581386, 15, 1),
(236, 'Star Lake', '13690', 44.157762, -75.033015, 3, 1),
(237, 'Lucile', '83542', 45.556963, -116.266899, 27, 1),
(238, 'Ferdinand', '47532', 38.233582, -86.860669, 32, 1),
(239, 'Cassville', '65625', 36.678386, -93.84667, 33, 1),
(240, 'Wilkes Barre', '18768', 41.272248, -75.880146, 26, 1),
(241, 'Kenduskeag', '04450', 44.918251, -68.934179, 23, 1),
(242, 'Bay City', '77404', 28.798156, -95.651058, 2, 1),
(243, 'Brigham City', '84302', 41.507921, -112.015177, 47, 1),
(244, 'Minden', '71058', 32.576948, -93.250705, 22, 1),
(245, 'Endicott', '68350', 40.049596, -97.081254, 11, 1),
(246, 'Bethany', '64424', 40.260055, -94.018863, 33, 1),
(247, 'Waterloo', '13165', 42.904515, -76.875498, 3, 1),
(248, 'Cromona', '41810', 37.178814, -82.69498, 40, 1),
(249, 'Cygnet', '43413', 41.247024, -83.614151, 21, 1),
(250, 'Weinert', '76388', 33.324872, -99.666431, 2, 1),
(251, 'Paragonah', '84760', 37.89172, -112.773972, 47, 1),
(252, 'Fordoche', '70732', 30.657644, -91.626406, 22, 1),
(253, 'Groton', '05046', 44.220435, -72.217548, 19, 1),
(254, 'Cary', '27512', 35.808387, -78.839488, 17, 1),
(255, 'Mililani', '96789', 21.45311, -158.017379, 50, 1),
(256, 'Bondville', '61815', 40.10838, -88.378167, 30, 1),
(257, 'Orange Cove', '93646', 36.625475, -119.32041, 15, 1),
(258, 'Tower City', '58071', 46.911873, -97.659392, 42, 1),
(259, 'Proctor', '74457', 36.03083992, -94.7613220215, 1, 1),
(260, 'Carson City', '48811', 43.169496, -84.865334, 25, 1),
(261, 'South Dos Palos', '93665', 37.01349, -120.744668, 15, 1),
(262, 'Lodgepole', '57640', 45.823193, -102.759917, 35, 1),
(263, 'Chittenango', '13133', 43.006893, -75.799544, 3, 1),
(264, 'Tatamy', '18085', 40.740625, -75.254854, 26, 1),
(265, 'Novato', '94948', 38.148858, -122.573745, 15, 1),
(266, 'Prince Frederick', '20678', 38.533629, -76.595495, 44, 1),
(267, 'Wa Keeney', '67672', 39.011415, -99.881824, 18, 1),
(268, 'Nampa', '83651', 43.58342, -116.584818, 27, 1),
(269, 'Farrar', '63746', 37.734776, -89.811616, 33, 1),
(270, 'Berkeley', '94703', 37.863028, -122.274914, 15, 1),
(271, 'Sedona', '86351', 35.032371, -111.684752, 36, 1),
(272, 'Appleton', '56208', 45.20543, -95.994872, 39, 1),
(273, 'Holmes', '12531', 41.532461, -73.662751, 3, 1),
(274, 'Manchaca', '78652', 30.123827, -97.839325, 2, 1),
(275, 'Franconia', '18924', 40.308116, -75.358575, 26, 1),
(276, 'Fort Loudon', '17224', 39.954692, -77.898365, 26, 1),
(277, 'Sipesville', '15561', 40.096406, -79.090158, 26, 1),
(278, 'Terril', '51364', 43.324073, -94.973725, 24, 1),
(279, 'West Union', '26456', 39.276185, -80.791057, 37, 1),
(280, 'Sackets Harbor', '13685', 43.93983, -76.105039, 3, 1),
(281, 'Le Mars', '51031', 42.79623, -96.170386, 24, 1),
(282, 'Anaheim', '92825', 33.835647, -117.913197, 15, 1),
(283, 'West Dummerston', '05357', 42.957233, -72.62408, 19, 1),
(284, 'Trenton', '08601', 40.280531, -74.712018, 8, 1),
(285, 'Gouldsboro', '18424', 41.2448, -75.503653, 26, 1),
(286, 'Manchester', '37349', 35.497637, -86.07482, 4, 1),
(287, 'Banning', '92220', 33.92816, -116.889928, 15, 1),
(288, 'Sioux City', '51101', 42.497223, -96.40292, 24, 1),
(289, 'Burnett', '53922', 43.511609, -88.717606, 41, 1),
(290, 'Gulfport', '39507', 30.396248, -89.035347, 34, 1),
(291, 'West Newton', '02465', 42.378145, -71.213199, 29, 1),
(292, 'Verona', '58490', 46.371229, -98.089536, 42, 1),
(293, 'Roanoke', '70581', 30.246362, -92.742134, 22, 1),
(294, 'Ward', '72176', 34.95316, -91.900383, 13, 1),
(295, 'Plant City', '33563', 28.012998, -82.133944, 5, 1),
(296, 'Worcester', '01608', 42.262425, -71.800262, 29, 1),
(297, 'New Bethlehem', '16242', 40.9999, -79.352654, 26, 1),
(298, 'Montrose', '52639', 40.513915, -91.423985, 24, 1),
(299, 'Menomonee Falls', '53051', 43.160174, -88.112774, 41, 1),
(300, 'Cedartown', '30125', 34.011196, -85.2459, 14, 1),
(301, 'Mesa', '85215', 33.470724, -111.718829, 36, 1),
(302, 'Flint', '48550', 43.034927, -83.688706, 25, 1),
(303, 'Amarillo', '79108', 35.277866, -101.830025, 2, 1),
(304, 'Manley Hot Springs', '99756', 65.226375, -151.025085, 9, 1),
(305, 'Orient', '50858', 41.219191, -94.370496, 24, 1),
(306, 'Bedford', '44146', 41.392067, -81.52315, 21, 1),
(307, 'Hope', '07844', 40.919658, -74.984628, 8, 1),
(308, 'Broomfield', '80020', 39.924513, -105.060902, 12, 1),
(309, 'Mc Carr', '41544', 37.596944, -82.167365, 40, 1),
(310, 'Hiawatha', '52233', 42.042455, -91.67696, 24, 1),
(311, 'South Bloomingville', '43152', 39.417379, -82.592291, 21, 1),
(312, 'Branchton', '16021', 40.921145, -79.92758, 26, 1),
(313, 'Howell', '48843', 42.615933, -83.92481, 25, 1),
(314, 'Homer', '46146', 39.619923, -85.46554, 32, 1),
(315, 'Sherwood', '54169', 44.167388, -88.229438, 41, 1),
(316, 'Saint Clair', '56080', 44.081669, -93.857123, 39, 1),
(317, 'Dalton', '53926', 43.67178, -89.191768, 41, 1),
(318, 'Upper Frenchville', '04784', 47.280036, -68.424812, 23, 1),
(319, 'Fargo', '58108', 46.934596, -97.229718, 42, 1),
(320, 'Hazleton', '47640', 38.462283, -87.498348, 32, 1),
(321, 'Norway', '52318', 41.899176, -91.89197, 24, 1),
(322, 'Oxford', '48370', 42.826451, -83.200455, 25, 1),
(323, 'Whitehouse', '43571', 41.519432, -83.81151, 21, 1),
(324, 'Cuttingsville', '05738', 43.522084, -72.869089, 19, 1),
(325, 'Jacksonville', '32241', 30.34494, -81.683107, 5, 1),
(326, 'Encino', '88321', 34.61496, -105.483914, 6, 1),
(327, 'Sikes', '71473', 32.068616, -92.442894, 22, 1),
(328, 'Harrah', '98933', 46.410383, -120.573606, 31, 1),
(329, 'Lyons', '57041', 43.728488, -96.870928, 35, 1),
(330, 'Pewee Valley', '40056', 38.303945, -85.483377, 40, 1),
(331, 'Le Grand', '50142', 42.020946, -92.775909, 24, 1),
(332, 'Craley', '17312', 39.946739, -76.506639, 26, 1),
(333, 'Syracuse', '13202', 43.040988, -76.148856, 3, 1),
(334, 'Pursglove', '26546', 39.674575, -80.034965, 37, 1),
(335, 'Wrightstown', '54180', 44.494921, -88.124743, 41, 1),
(336, 'Alden', '60001', 42.324761, -88.452481, 30, 1),
(337, 'Ora', '46968', 41.175557, -86.554326, 32, 1),
(338, 'Lime Ridge', '53942', 43.468211, -90.161478, 41, 1),
(339, 'Standish', '04084', 43.814211, -70.480657, 23, 1),
(340, 'Rosedale', '47874', 39.62391, -87.308592, 32, 1),
(341, 'Austin', '78723', 30.308515, -97.684941, 2, 1),
(342, 'Thurmond', '28683', 36.356188, -80.931674, 17, 1),
(343, 'Grand Junction', '81503', 39.056777, -108.575609, 12, 1),
(344, 'Watha', '28471', 34.620725, -78.007351, 17, 1),
(345, 'Danville', '04223', 44.023873, -70.285748, 23, 1),
(346, 'Chula Vista', '91914', 32.65875, -116.96517, 15, 1),
(347, 'North Houston', '77315', 29.83399, -95.434241, 2, 1),
(348, 'Phippsburg', '04562', 43.768816, -69.814982, 23, 1),
(349, 'Hoffman', '62250', 38.540877, -89.436298, 30, 1),
(350, 'Niles', '49121', 42.001551, -86.715294, 25, 1),
(351, 'Omaha', '68106', 41.240322, -95.997972, 11, 1),
(352, 'Breaux Bridge', '70517', 30.240316, -91.828827, 22, 1),
(353, 'Bellflower', '90706', 33.886676, -118.126527, 15, 1),
(354, 'Mount Prospect', '60056', 42.062392, -87.937667, 30, 1),
(355, 'Pittsboro', '27312', 35.769436, -79.175509, 17, 1),
(356, 'Iron Springs', '86330', 34.706724, -112.39773, 36, 1),
(357, 'Addison', '14801', 42.09825, -77.266027, 3, 1),
(358, 'San Francisco', '94175', 37.784827, -122.727802, 15, 1),
(359, 'Matthews', '28104', 35.089042, -80.704424, 17, 1),
(360, 'Cheneyville', '71325', 31.020097, -92.295144, 22, 1),
(361, 'Banta', '95304', 37.7149, -121.385, 15, 1),
(362, 'Burrel', '93607', 36.589797, -119.899405, 15, 1),
(363, 'Caddo Mills', '75135', 33.068267, -96.239093, 2, 1),
(364, 'Monroeton', '18832', 41.713484, -76.487176, 26, 1),
(365, 'Bristol', '24202', 36.621571, -82.167633, 7, 1),
(366, 'Mount Hope', '67108', 37.868412, -97.659092, 18, 1),
(367, 'Georgetown', '45121', 38.871708, -83.909153, 21, 1),
(368, 'Paradise Valley', '89426', 41.505726, -117.572848, 43, 1),
(369, 'Garden Valley', '83622', 44.090932, -115.824311, 27, 1),
(370, 'Strathmore', '93267', 36.147237, -119.079163, 15, 1),
(371, 'Copiague', '11726', 40.677833, -73.396271, 3, 1),
(372, 'Yalaha', '34797', 28.744443, -81.826324, 5, 1),
(373, 'Acworth', '30102', 34.07068, -84.589406, 14, 1),
(374, 'Palm Beach', '33480', 26.72065, -80.038825, 5, 1),
(375, 'Wendel', '15691', 40.294021, -79.686626, 26, 1),
(376, 'Yorba Linda', '92686', 33.888197, -117.80139, 15, 1),
(377, 'Pratts Hollow', '13434', 42.922778, -75.603056, 3, 1),
(378, 'Sparks', '69220', 42.542631, -101.126167, 11, 1),
(379, 'West River', '20778', 38.825194, -76.539113, 44, 1),
(380, 'Brownville', '13615', 44.057685, -76.019634, 3, 1),
(381, 'Hanover', '17334', 39.804999, -76.973625, 26, 1),
(382, 'Paola', '66071', 38.571999, -94.893694, 18, 1),
(383, 'Scammon', '66773', 37.280945, -94.809198, 18, 1),
(384, 'Des Moines', '50395', 41.672687, -93.572173, 24, 1),
(385, 'Cook', '55723', 47.844193, -92.721038, 39, 1),
(386, 'Milltown', '47145', 38.344453, -86.300344, 32, 1),
(387, 'Lenox Dale', '01242', 42.338594, -73.250891, 29, 1),
(388, 'Bosque Farms', '87068', 34.876366, -106.697506, 6, 1),
(389, 'Greensboro', '27409', 36.077683, -79.908602, 17, 1),
(390, 'Rio', '26755', 39.18471, -78.726985, 37, 1),
(391, 'Dayton', '59914', 47.860749, -114.280918, 10, 1),
(392, 'Layland', '25864', 38.041293, -81.064784, 37, 1),
(393, 'Sadieville', '40370', 38.390816, -84.538424, 40, 1),
(394, 'Groveport', '43199', 39.969036, -83.011389, 21, 1),
(395, 'Higganum', '06441', 41.468246, -72.575143, 48, 1),
(396, 'Cedar Hill', '63016', 38.357319, -90.649777, 33, 1),
(397, 'Hyde Park', '05655', 44.622453, -72.594971, 19, 1),
(398, 'Mattoon', '61938', 39.480184, -88.376152, 30, 1),
(399, 'New Berlin', '13411', 42.622414, -75.347406, 3, 1),
(400, 'Wyanet', '61379', 41.378452, -89.574423, 30, 1),
(401, 'Burns', '97720', 43.51451, -119.050398, 20, 1),
(402, 'Laurel', '20709', 38.833563, -76.877743, 44, 1),
(403, 'Oconto', '68860', 41.138075, -99.695112, 11, 1),
(404, 'Dry Run', '17220', 40.178081, -77.735336, 26, 1),
(405, 'Homer City', '15748', 40.627752, -79.089616, 26, 1),
(406, 'Honolulu', '96801', 24.859832, -168.021815, 50, 1),
(407, 'Cobham', '22929', 38.036225, -78.382004, 7, 1),
(408, 'Easton', '18044', 40.693376, -75.471156, 26, 1),
(409, 'Wolf', '82844', 44.850012, -107.185309, 45, 1),
(410, 'Berlin', '58415', 46.400834, -98.523342, 42, 1),
(411, 'Texline', '79087', 36.374034, -102.984516, 2, 1),
(412, 'Calvin', '58323', 48.77178, -98.464102, 42, 1),
(413, 'Pineville', '64856', 36.573955, -94.377022, 33, 1),
(414, 'Bowling Green', '42103', 36.96629, -86.393321, 40, 1),
(415, 'Charleston', '25357', 38.296818, -81.554655, 37, 1),
(416, 'Kite', '31049', 32.707833, -82.527361, 14, 1),
(417, 'Chase', '21027', 39.438964, -76.592139, 44, 1),
(418, 'South China', '04358', 44.395334, -69.58036, 23, 1),
(419, 'Amissville', '20106', 38.6842, -78.016813, 7, 1),
(420, 'Albion', '99102', 46.934379, -117.412136, 31, 1),
(421, 'Butte', '58723', 47.811884, -100.660446, 42, 1),
(422, 'Laverne', '73848', 36.70625, -99.891766, 1, 1),
(423, 'Sigurd', '84657', 38.848233, -111.973737, 47, 1),
(424, 'Grand Rapids', '49514', 43.031413, -85.550267, 25, 1),
(425, 'South Lake Tahoe', '96150', 38.916976, -119.986469, 15, 1),
(426, 'Wichita Falls', '76310', 33.858122, -98.575548, 2, 1),
(427, 'Wells', '12190', 43.401219, -74.288583, 3, 1),
(428, 'Creola', '36525', 30.901267, -88.017414, 16, 1),
(429, 'Brentwood', '37024', 35.874553, -86.907565, 4, 1),
(430, 'Magnet', '68749', 42.609687, -97.250378, 11, 1),
(431, 'Poultney', '05764', 43.53321, -73.225281, 19, 1),
(432, 'Elmhurst', '60126', 41.892661, -87.941025, 30, 1),
(433, 'Lehigh Acres', '33974', 26.5677, -81.5954, 5, 1),
(434, 'Anna', '75409', 33.344516, -96.563862, 2, 1),
(435, 'Blanchard', '83804', 48.022344, -116.990865, 27, 1),
(436, 'Rinard', '62878', 38.580596, -88.464094, 30, 1),
(437, 'West Sacramento', '95691', 38.5673, -121.5516, 15, 1),
(438, 'Spring Lake', '28390', 35.182981, -78.978555, 17, 1),
(439, 'Techny', '60082', 42.116377, -87.812064, 30, 1),
(440, 'Mt Zion', '62549', 39.825599, -88.907654, 30, 1),
(441, 'Virginia Beach', '23453', 36.775992, -76.076611, 7, 1),
(442, 'Santa Maria', '93455', 34.883589, -120.377957, 15, 1),
(443, 'Clarks Grove', '56016', 43.762971, -93.323222, 39, 1),
(444, 'Hendricks', '56136', 44.499514, -96.407753, 39, 1),
(445, 'Millersview', '76862', 31.416745, -99.717137, 2, 1),
(446, 'Jermyn', '18433', 41.561174, -75.618764, 26, 1),
(447, 'Savannah', '31414', 31.971394, -81.07156, 14, 1),
(448, 'Winston Salem', '27106', 36.142762, -80.306866, 17, 1),
(449, 'Carlton', '30627', 33.985217, -83.003827, 14, 1),
(450, 'Boyers', '16020', 41.109205, -79.904692, 26, 1),
(451, 'Emigrant', '59027', 45.270789, -110.792071, 10, 1),
(452, 'Saint Petersburg', '33709', 27.820082, -82.730798, 5, 1),
(453, 'San Leandro', '94579', 37.689209, -122.150659, 15, 1),
(454, 'Camp Grove', '61424', 41.077977, -89.633233, 30, 1),
(455, 'Salt Lake City', '84141', 40.668068, -111.908297, 47, 1),
(456, 'Paw Creek', '28130', 35.26002, -80.804151, 17, 1),
(457, 'Antler', '58711', 48.958525, -101.333758, 42, 1),
(458, 'White Deer', '79097', 35.42781, -101.173993, 2, 1),
(459, 'Whitewater', '59544', 48.224749, -108.035444, 10, 1),
(460, 'Loda', '60948', 40.524097, -88.092675, 30, 1),
(461, 'Albuquerque', '87120', 35.142146, -106.704137, 6, 1),
(462, 'Jamestown', '46147', 39.95789, -86.623561, 32, 1),
(463, 'Collins Center', '14035', 42.49064, -78.849861, 3, 1),
(464, 'Hereford', '80732', 40.975104, -104.305265, 12, 1),
(465, 'Wadena', '52169', 42.854956, -91.663865, 24, 1),
(466, 'Griffith', '46319', 41.53352, -87.422837, 32, 1),
(467, 'Bicknell', '47512', 38.77272, -87.313718, 32, 1),
(468, 'Statesboro', '30460', 32.41795, -81.78233, 14, 1),
(469, 'Burnside', '70738', 30.204707, -90.869481, 22, 1),
(470, 'Huger', '29450', 33.043929, -79.784137, 51, 1),
(471, 'Rock Island', '61201', 41.491317, -90.564796, 30, 1),
(472, 'Harrogate', '37752', 36.576718, -83.607262, 4, 1),
(473, 'Boca Raton', '', 26.35049, -80.089004, 5, 1),
(548, 'Winter Park', '', 28.599896, -81.35127, 5, 1),
(549, '', '', 40.428191, -79.914538, 0, 1),
(550, 'Winter Park', '', 28.599896, -81.35127, 5, 1),
(551, 'Winter Park', '', 28.594574, -81.350716, 5, 1),
(552, '', '', 28.594574, -81.350716, 0, 1),
(553, 'Winter Park', '', 28.594574, -81.350716, 5, 1),
(554, 'Winter Park', '', 28.6024, -81.3589, 5, 1),
(555, '', '', 28.6024, -81.3589, 0, 1),
(556, 'Winter Park', '', 28.6024, -81.3589, 5, 1),
(557, 'Winter Park', '', 28.622235, -81.333692, 5, 1),
(558, '', '', 28.622235, -81.333692, 0, 1),
(559, 'Winter Park', '', 28.622235, -81.333692, 5, 1),
(560, 'Winter Park', '', 28.598603, -81.364788, 5, 1),
(561, '', '', 28.598603, -81.364788, 0, 1),
(562, 'Winter Park', '', 28.598603, -81.364788, 5, 1),
(563, 'Palm Coast', '', 29.584827, -81.207715, 5, 1),
(564, '', '', 29.584827, -81.207715, 0, 1),
(565, 'Palm Coast', '', 29.584827, -81.207715, 5, 1),
(566, 'Floral City', '', 28.7309, -82.2924, 5, 1),
(567, '', '', 28.7309, -82.2924, 0, 1),
(568, 'Floral City', '', 28.7309, -82.2924, 5, 1),
(569, 'Winter Park', '', 28.6079, -81.3055, 5, 1),
(570, '', '', 28.6079, -81.3055, 0, 1),
(571, 'Winter Park', '', 28.6079, -81.3055, 5, 1),
(572, 'Winter Park', '', 28.6079, -81.3055, 5, 1),
(573, '', '', 28.6079, -81.3055, 0, 1),
(574, 'Winter Park', '', 28.6079, -81.3055, 5, 1),
(575, 'Winter Park', '', 28.6079, -81.3055, 5, 1),
(576, '', '', 28.6079, -81.3055, 0, 1),
(577, 'Winter Park', '', 28.6079, -81.3055, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `station-id` int(11) NOT NULL,
  `station-uuid` varchar(64) NOT NULL,
  `user-id` int(11) NOT NULL,
  `user-uuid` varchar(64) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `company-id` int(11) NOT NULL,
  `parent-id` int(11) DEFAULT NULL,
  `format` text NOT NULL,
  `type` text NOT NULL,
  `name` text NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `href` text NOT NULL,
  `preg` text NOT NULL,
  `auth_level` int(11) DEFAULT NULL,
  `nav-hidden` enum('0','1') NOT NULL DEFAULT '1',
  `nav-order` int(11) NOT NULL DEFAULT '0',
  `path-model` text NOT NULL,
  `path-view` text NOT NULL,
  `path-presenter` text NOT NULL,
  `template-view` varchar(128) NOT NULL DEFAULT 'sub',
  `content` text NOT NULL,
  `content-plain` text NOT NULL,
  `excerpt` text NOT NULL,
  `tokens` text NOT NULL,
  `editing` enum('0','1') NOT NULL DEFAULT '0',
  `locked` enum('0','1') NOT NULL DEFAULT '0',
  `template` int(11) DEFAULT NULL,
  `robots` enum('0','1') NOT NULL DEFAULT '1',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `uuid`, `site-id`, `company-id`, `parent-id`, `format`, `type`, `name`, `title`, `slug`, `href`, `preg`, `auth_level`, `nav-hidden`, `nav-order`, `path-model`, `path-view`, `path-presenter`, `template-view`, `content`, `content-plain`, `excerpt`, `tokens`, `editing`, `locked`, `template`, `robots`, `updated`, `active`) VALUES
(1, 'r74TQPdO8raqNAL8X2v7SKsv9tmivjyR312WV2ktpq6oeCGgH0O60xHR4625pB6', 1, 1, 0, '', 'home', 'Home', 'Welcome - __SITE-NAME__', 'home', '/', '', NULL, '1', 0, 'page', 'view', 'pages', 'index', '', '', '', '', '0', '0', NULL, '1', '2014-10-23 16:44:28', '1');

-- --------------------------------------------------------

--
-- Table structure for table `pages-content_attachments`
--

CREATE TABLE IF NOT EXISTS `pages-content_attachments` (
  `page-id` int(11) NOT NULL,
  `content_attachment-id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pages-meta`
--

CREATE TABLE IF NOT EXISTS `pages-meta` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `company-id` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `keywords` text NOT NULL,
  `date-created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date-modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `date-published` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last-edited-user-id` int(11) NOT NULL,
  `show-title_stub` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL,
  `uuid` text NOT NULL,
  `site-id` int(11) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `magic` text NOT NULL,
  `user-id` int(11) NOT NULL,
  `user-uuid` text NOT NULL,
  `company-id` int(11) NOT NULL,
  `company-uuid` text NOT NULL,
  `site-uuid` text NOT NULL,
  `action` text NOT NULL,
  `data` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE IF NOT EXISTS `sites` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `company-id` int(11) NOT NULL,
  `name` text NOT NULL,
  `name_legal` text NOT NULL,
  `slug` text NOT NULL,
  `doc_root` text NOT NULL,
  `domains-dev` text NOT NULL,
  `domains-beta` text NOT NULL,
  `domains-live` text NOT NULL,
  `domain` text NOT NULL,
  `force-www` enum('0','1') NOT NULL DEFAULT '1',
  `industry-id` int(11) NOT NULL DEFAULT '1',
  `theme-id` int(11) DEFAULT NULL,
  `template-id` int(11) DEFAULT NULL,
  `sidebar-position` text NOT NULL,
  `str-salutation` text NOT NULL,
  `str-title-sep` varchar(64) NOT NULL DEFAULT ' - ',
  `setup` enum('0','1') NOT NULL DEFAULT '0',
  `trial` enum('0','1') NOT NULL DEFAULT '0',
  `active` enum('0','1') NOT NULL DEFAULT '0',
  `robots` enum('0','1') NOT NULL DEFAULT '0',
  `sandbox` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `uuid`, `company-id`, `name`, `name_legal`, `slug`, `doc_root`, `domains-dev`, `domains-beta`, `domains-live`, `domain`, `force-www`, `industry-id`, `theme-id`, `template-id`, `sidebar-position`, `str-salutation`, `str-title-sep`, `setup`, `trial`, `active`, `robots`, `sandbox`) VALUES
(1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 0, 'Site', 'Site', 'site', 'site', 'site.dev', 'beta.site.com', 'site.com', 'site.com', '1', 1, 1, 1, '', '', ' - ', '1', '0', '1', '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `sites-forms`
--

CREATE TABLE IF NOT EXISTS `sites-forms` (
  `site-id` int(11) NOT NULL,
  `company-id` int(11) DEFAULT NULL,
  `form-id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sites-pages`
--

CREATE TABLE IF NOT EXISTS `sites-pages` (
  `id` int(11) NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) DEFAULT NULL,
  `page-id` int(11) NOT NULL,
  `page-uuid` varchar(64) DEFAULT NULL,
  `nav-hidden` enum('0','1') DEFAULT NULL,
  `nav-order` int(11) DEFAULT NULL,
  `redux-name` text,
  `redux-title` text,
  `redux-slug` text,
  `redux-href` text,
  `redux-type` varchar(64) DEFAULT NULL,
  `redux-content` text,
  `redux-content-plain` text,
  `redux-template-view` text,
  `redux-robots` enum('0','1') NOT NULL DEFAULT '1',
  `redux-updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `redux-active` enum('0','1') DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sites-pages`
--

INSERT INTO `sites-pages` (`id`, `site-id`, `site-uuid`, `page-id`, `page-uuid`, `nav-hidden`, `nav-order`, `redux-name`, `redux-title`, `redux-slug`, `redux-href`, `redux-type`, `redux-content`, `redux-content-plain`, `redux-template-view`, `redux-robots`, `redux-updated`, `redux-active`) VALUES
(1, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 3, '9wNVJjPJzwhaCw4abLMxI0WlOkGFmWzEb8clmtZFkAPf8IvpmTASMstNFhaKqco', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-10-28 15:58:32', NULL),
(2, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 6, 'A990FE6E66DAFE6871E522B11FAEFDEA685E384118284737E3F74343FD4013FC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-10-28 16:12:10', NULL),
(3, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 7, 'TZHhVs7hADbOcy26tlEXMycRk4EDGutLaSuEPe68mdzLWJSmi4hK1ohh0K9vq4f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 18:01:22', NULL),
(4, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 8, 'Yiz8DzVbI6bjGL3et5HuDnRgHeDHlgBBeJQcCLQfh7IGtbmPOJuqQM0dDJ06p1C', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 18:51:49', NULL),
(5, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 9, '3BB8808D0AC3E937457C82A7EAD99485E46C912F8A233BD2F2DE97D1363393B8', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 19:32:54', NULL),
(6, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 10, 'gVzz5brRgH618flMetnwZHrL68k60lMzXoNDukqUbCPly0Qrybe7bpRwm9gvPAH', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 19:33:28', NULL),
(7, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 11, '2FFE7354E963D89DFA7A753F44B16328E5D37AB99D4564F2B0888C70715DD6B0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 19:33:49', NULL),
(8, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 12, 'd0bFMtg9ceQSMAhnZjmEENuczCRsinaUucb56oupomKxDi0ML1UtWfkYrtvKUrv', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 19:34:24', NULL),
(9, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 13, '60BB7CB5C1912A38C539E33D15F8B38A3CE54D8510DA963CD5F668C31A8443DC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-03 19:34:43', NULL),
(10, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 15, '5QTBM3skNMVmnqg0TDYhGbeZez81paQUZdBCu6IbCCr4Pdp5LXhs2NUvd2x6rXF', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-04 21:04:53', NULL),
(11, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 2, 'mihWZRTmVCwvX2w9Mm4B6H1cfOwryA8RurgWIqmZZqcznwopW1OZ7UkXzbpYAcj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-04 21:15:42', NULL),
(12, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 4, '0853BAADAE1819694FA57734A229256FF2F0BADD1470C31B72EB2504E9BB244A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-05 16:26:31', NULL),
(13, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 14, 'PSGWAw8JEbb4RV1YEMp5vTYidPsH5CgtxvgUUYEZiQ6Ww9VgNZhv7AwzcrlW0Ht', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-05 19:27:04', NULL),
(14, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 5, 'SJHcIEF3VNPx2nVtwUt9bEM8Nhfno8Nc6mCnGAhaYNRnE39jEkErMSUISd7mwSn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-06 17:33:19', NULL),
(15, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 17, 'pLBuZrpKN03y7W0vKv4Sf7j9VwAm2Miek2fzKa73eM1jslZANjuvyrVql7dM9PY', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-30 20:08:45', NULL),
(16, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 18, '83820E155E17FAA1EE4885819DFAE7975FC5C15A02878F6B9A18A13CB8EB5A06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-30 20:08:43', NULL),
(17, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 19, 'addogaEY9iBaty7xH0UQC2kb9GestTyu7BvSC0OYQKMmPGpnvT0JHgkxgSkciyX', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-30 20:08:39', NULL),
(18, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 16, 'jIRiUJ00MOn10Li3Mc6MRrL3YJbky9cs5xyNoXUR7qmhM3bouSYHJpFIO3Ilso1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-30 20:08:48', NULL),
(19, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 20, 'VSQtPFlKW1iYaCexHADFnIBBOxhYlbsxt6jXGJDV7V6HXPRPTYtJEUJqquDiSP4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:35:44', NULL),
(20, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 21, '9D8DBF37CCFB196A0114336124F1932723CC77F58B89022AA9B066F99D8DE1D5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:35:44', NULL),
(21, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 22, 'bIZhOF8vYGL7AQumzZ4WvTMbkzxgzmJUsVF3LgqBdV9MzGFTcPMLScyIlXdCAQE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:37:05', NULL),
(22, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 23, '33E6A3F1CD6ED9C09AB2CBC8467A8593C70C5CD7859876CF760A1A2A23DCA220', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:37:05', NULL),
(23, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 24, 'fsJZmMH01S6KYXu3DUpRjJQto9KnkYoUHfnL6SfJRc744X4Ib7fcCfsx9VvBYEV', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:42:29', NULL),
(24, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 25, 'ED83DC76EA663FA05D3F4BC184FCDABF4AD8FEFD3057A77E4FBD16A2A826A8F4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:42:29', NULL),
(25, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 26, 'rvz4pqSx5gYiz2E8eGzC7rDJDvSPb5XkxjRWOVgjW8sT2IIUUHrdxHEudBsY7FT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:43:27', NULL),
(26, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 27, '98qeqfAVJe7YOmPFMMmyyT73LxIYUZFYJ4FTBviGtcIhyMBk5frB354Uvsi7kcA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:43:27', NULL),
(27, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 28, '45531DE8734DBB47E6817E54F07810B7E27F4526CCD5F055CE62B58F3FF5B960', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:45:06', NULL),
(28, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 29, 'z77UMtgRUBoDhnepyJQ4uMfc8JbWm0sT3Patr6AJOgWf2BUNQsSksc5PbBuq7DB', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-11-29 22:45:06', NULL),
(29, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 30, 'JO0ATWYDO4EhJVBYXzeuj1TpZsapScl8FajRccjYtYYPEEZanbdzpC7MNqLinkT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2014-12-29 02:32:55', NULL),
(30, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 31, 'ElVV6xK0aketD5ma0bTK28rCFp8vbzuwB7iYO7dbZx9sSl2lrPSquKwavfkYWHu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-01-14 03:26:29', NULL),
(31, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 32, 'r8qxfvB2ngPrSVKWmAfYTPdqRDof29oNucHhlNPfKH32lEbGfdUxoRrDuqOnWkU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-01-20 04:24:42', NULL),
(32, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 33, '3IMlS5j04dkwdCIk4YIhH6bAWvJXiHbDnrLeX2gZtSzuec462f85CDJiJ3VvrC7', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-02-01 03:57:18', NULL),
(33, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 34, '9B62F5964DCB5B507EF040BE2C3098EBAEC5B34496701190F3594C786F233B96', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-02-01 04:01:29', NULL),
(34, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 35, 'IGN2ZK05RtZaSwh6vOL2DanJqPHhlyw7FFSUCAVrexMwqLIJfFiCQVnl4FfweEM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-02-01 16:41:47', NULL),
(35, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 36, 'mrbkIkQpbT4GGU3E7ZAAlJ76006Xar6BYQnEBWMvLvDvynrEfaXNewumOlsl48G', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-03-16 03:03:08', NULL),
(36, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 37, 'kC17V6mM0rr0lrPaWZArlbgBDgyY5NjS8Oi892w0u5wwDhULjqDxqOGDkBDhtO6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-03-20 03:29:02', NULL),
(37, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 38, '48Y9Yqj57CqiivXQKKCkhpwjnu1z6qa0CPlYsFcUeyyFMNSwAY0HWKCS4A0XbCM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-03-22 05:35:41', NULL),
(38, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 39, 'yRxBJ7nK078HCy7VwvsDMWodMYe0DayNcjfuhryR7oZzkBqVevcSqkIZ6MtEoLU', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-03-24 22:41:31', NULL),
(39, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 40, 'ekuWGVvTdjidAkN3sED41EJki7HjMeG3WYziRgwSvd5llX5moLRpsSDMBFtEbj', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-03-25 03:23:45', NULL),
(40, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 41, 'GsVihZst7kfVk766Y834jPa1Q94iYvdAR2OfAslQO9olQj9EpozCv59uJsZZ2OS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-05-14 00:51:39', NULL),
(41, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 42, 'VkOVw56aFufYZQPUJ4fFGkevdCN6YXHNL53cFYrvWFkWAtlNj1FrFGiSVTdERtf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-07-22 03:36:46', NULL),
(42, 1, '37BDE418C2B000D70128265093E0BC9910FBD51ADAD3AAA3DD89B2BDBB007BA3', 44, '7tYOoftbB23kVwmKSj3azV330CxOnI9eauwmEnbJWnv4zAna9MW4rHy8tcXLxFv', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '2015-08-18 02:13:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sites-seo-robots`
--

CREATE TABLE IF NOT EXISTS `sites-seo-robots` (
  `site-id` int(11) NOT NULL DEFAULT '0',
  `site-uuid` varchar(64) NOT NULL,
  `page-id` int(11) DEFAULT NULL,
  `page-uuid` varchar(64) DEFAULT NULL,
  `useragent-id` int(11) DEFAULT NULL,
  `useragent-uuid` varchar(64) DEFAULT NULL,
  `href` text,
  `allow` enum('0','1') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sites-templates`
--

CREATE TABLE IF NOT EXISTS `sites-templates` (
  `site-id` int(11) NOT NULL,
  `company-id` int(11) NOT NULL,
  `template-id` int(11) NOT NULL,
  `header-bg` text NOT NULL,
  `logo` text NOT NULL,
  `sidebar-placement` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sites-templates`
--

INSERT INTO `sites-templates` (`site-id`, `company-id`, `template-id`, `header-bg`, `logo`, `sidebar-placement`) VALUES
(1, 1, 1, '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `sites-themes`
--

CREATE TABLE IF NOT EXISTS `sites-themes` (
  `site-id` int(11) NOT NULL,
  `company-id` int(11) NOT NULL,
  `theme-id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sites-themes`
--

INSERT INTO `sites-themes` (`site-id`, `company-id`, `theme-id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sites-widgets`
--

CREATE TABLE IF NOT EXISTS `sites-widgets` (
  `site-id` int(11) NOT NULL,
  `widget-id` int(11) NOT NULL,
  `widget-data` int(11) DEFAULT NULL,
  `widget-pos` int(11) DEFAULT NULL,
  `sidebar` enum('0','1') NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE IF NOT EXISTS `templates` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `parent-id` int(11) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `path` text NOT NULL,
  `path-rel` text NOT NULL,
  `preview-color` text NOT NULL,
  `preview-image` text NOT NULL,
  `nav-style` varchar(64) NOT NULL DEFAULT 'top',
  `max-nav-items` int(11) NOT NULL DEFAULT '5',
  `has-sidebar` enum('0','1') NOT NULL DEFAULT '0',
  `sidebar-position` text NOT NULL,
  `max-sidebar-widgets` text NOT NULL,
  `reserved` enum('0','1') NOT NULL DEFAULT '0',
  `hidden` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`id`, `uuid`, `parent-id`, `name`, `slug`, `path`, `path-rel`, `preview-color`, `preview-image`, `nav-style`, `max-nav-items`, `has-sidebar`, `sidebar-position`, `max-sidebar-widgets`, `reserved`, `hidden`) VALUES
(1, '004FF8AD219F4140679E09559BF0DBF9CE01F69250BC8564B11E286783D04A4F', 0, 'Site', 'site', 'site', 'site', '', '', 'top', 10, '0', '', '', '1', '0'),
(10, '5F00212F5700C48D622A1A503EB7550B204A03DAE1D87E89496D1C8F22E001E6', 0, 'Global Template', '_', '_', '', '', '', 'top', 5, '0', '', '', '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `templates-themes`
--

CREATE TABLE IF NOT EXISTS `templates-themes` (
  `site-id` text NOT NULL,
  `template-id` text NOT NULL,
  `theme-id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `templates-themes`
--

INSERT INTO `templates-themes` (`site-id`, `template-id`, `theme-id`) VALUES
('0', '1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE IF NOT EXISTS `themes` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL DEFAULT '0',
  `site-uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `preview-color` text NOT NULL,
  `preview-image` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `themes`
--

INSERT INTO `themes` (`id`, `uuid`, `site-id`, `site-uuid`, `name`, `slug`, `preview-color`, `preview-image`) VALUES
(1, 'rsSPjMS9aqmj1PuxmpQGgoYp6lGEkRWE7CPf5IQlhrFx25UVG8DzkdDOuMU2mV6', 0, '', 'Site', 'site', '#00B8D1', '');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE IF NOT EXISTS `types` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `className` text NOT NULL,
  `mime-ext` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user-security_questions`
--

CREATE TABLE IF NOT EXISTS `user-security_questions` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `val` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `useragents`
--

CREATE TABLE IF NOT EXISTS `useragents` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL DEFAULT '0',
  `site-uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `vendor` text NOT NULL,
  `engine` text NOT NULL,
  `pattern` text NOT NULL,
  `mobile` enum('0','1') NOT NULL DEFAULT '0',
  `description` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `useragents`
--

INSERT INTO `useragents` (`id`, `uuid`, `site-id`, `site-uuid`, `name`, `slug`, `vendor`, `engine`, `pattern`, `mobile`, `description`) VALUES
(1, 'iFpjtdhZPH4Y3eWHcQiit83l9sgojNWk7SKiMPJ5OCa884iD9gwzR6Qcorn1ykV', 0, '', 'Internet Explorer', 'ie', 'Microsoft', 'Trident', 'Trident[\\/].*rv:([0-9]*).([0-9.]*)', '0', ''),
(2, 'L2NWzUkNeEOxVFLYb1IjB9SZ7yDx7diwxEYsAmlu4sXSSaVp863Z1FF3G09XyRp', 0, '', 'Firefox', 'fx', 'Mozilla', 'Gecko', 'Firefox[\\/]*([0-9]*).([0-9.]*)', '0', ''),
(3, 'S2PRQxO9eEhY37JAwBa9dB0cCdgjcABtcnbSVfyvMyxgIChVuMm1jyXF5RdwdIF', 0, '', 'Safari', 'safari', 'Apple', 'WebKit', 'Version[\\/]*([0-9]*).([0-9.]*)[ ]*Safari[\\/]*([0-9.]*)', '0', ''),
(4, 'AvmWdSlcYxTJhX9CswvZzlaNElIylRaNCAZZpv3fwcFOHZeDT9jRBlewP9fTUTR', 0, '', 'Safari Mobile', 'safari-m', 'Apple', 'WebKit', 'Version[\\/]*([0-9]*).([0-9.]*)[ ]*Mobile[\\/]*[0-9A-Za-z]*[ ]*Safari[\\/]*([0-9.]*)', '1', ''),
(5, 'f3tQ4Vt8tk9njMxx6jlaTpLUBlRwxCZsnDWLlh2QgfeRulXd54w8jWwWeac8EZt', 0, '', 'Chrome', 'chrome', 'Google', 'WebKit', 'Chrome[\\/]*([0-9]*).([0-9.]*)[ ]*Safari[\\/]*([0-9.]*)', '0', ''),
(6, 'tW2iDaliGeKdtQDFhCbuT2OE5L0X8RQrJnfup9fGzOBzZWlhS0Npad1Nrgas25u', 0, '', 'Opera', 'opera', 'Opera', 'Presto', 'Opera[\\/]*([0-9]*).([0-9.]*)', '0', ''),
(7, 'uEpIlPbwn2zxQTl5hGtC5j5Z62FddIj1WvvFBtBZqmHsMawkN8fV3Zat9lPucwA', 0, '', 'Internet Explorer', 'ie', 'Microsoft', 'Trident', 'MSIE[ ]*([0-9]*).([0-9.]*)', '0', ''),
(8, 'JfASGknaJvPh7LohOmeFTeVUxEzafWecSa0DW8fxwcwFVttSJcBZjpkPdBAvvxJ', 0, '', 'Chrome for Android', 'chrome-android', 'Google', 'WebKit', 'Chrome[\\/]*([0-9]*).([0-9.]*)[ ]*Mobile[ ]*Safari[\\/]*([0-9.]*)', '1', ''),
(9, 'C5DAAF03FC35EDE5516FF7562727D5826F054CEC70D5EBD4AF5D7D0DEC0D9323', 0, '', 'Chrome for iOS', 'chrome-ios', 'Google', 'WebKit', 'CriOS[\\/]*([0-9]*).([0-9.]*)[ ]*Mobile[\\/]*([0-9A-Za-z.]*)[ ]*Safari[\\/]*([0-9.]*)', '1', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `uuid` text NOT NULL,
  `salt` text NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) NOT NULL,
  `company-id` int(11) NOT NULL,
  `group-id` int(11) NOT NULL,
  `group-uuid` varchar(64) NOT NULL,
  `username` text NOT NULL,
  `name-first` text NOT NULL,
  `name-last` text NOT NULL,
  `slug` text NOT NULL,
  `password` text NOT NULL,
  `password_strength` int(11) DEFAULT NULL,
  `hash` varchar(64) NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `phone-show` text NOT NULL,
  `address-street` text NOT NULL,
  `address-city` text NOT NULL,
  `address-state` text NOT NULL,
  `address-zip` text NOT NULL,
  `address-geo_region_id` text NOT NULL,
  `address-show` text NOT NULL,
  `auth_level` int(11) NOT NULL DEFAULT '1',
  `station-id` int(11) NOT NULL,
  `station-uuid` varchar(64) NOT NULL,
  `reset-hash` varchar(64) NOT NULL,
  `reset-expiry` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users-auth_levels`
--

CREATE TABLE IF NOT EXISTS `users-auth_levels` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users-groups`
--

CREATE TABLE IF NOT EXISTS `users-groups` (
  `user-id` int(11) NOT NULL,
  `user-uuid` varchar(64) NOT NULL,
  `site-id` int(11) NOT NULL,
  `site-uuid` varchar(64) NOT NULL,
  `company-id` int(11) NOT NULL,
  `company-uuid` varchar(64) NOT NULL,
  `group-id` int(11) NOT NULL,
  `group-uuid` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users-security_questions`
--

CREATE TABLE IF NOT EXISTS `users-security_questions` (
  `user-id` int(11) NOT NULL,
  `user-uuid` varchar(64) NOT NULL,
  `user-security_question-id` int(11) NOT NULL,
  `val` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `widgets`
--

CREATE TABLE IF NOT EXISTS `widgets` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL,
  `file` text NOT NULL,
  `preview-img` text NOT NULL,
  `sidebar` enum('0','1') NOT NULL DEFAULT '1',
  `generic` enum('0','1') NOT NULL DEFAULT '0',
  `hidden` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `301s`
--
ALTER TABLE `301s`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content_attachment-meta`
--
ALTER TABLE `content_attachment-meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content_attachment-meta-meta`
--
ALTER TABLE `content_attachment-meta-meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content_attachments`
--
ALTER TABLE `content_attachments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `content_types`
--
ALTER TABLE `content_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dirs`
--
ALTER TABLE `dirs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loc_cities`
--
ALTER TABLE `loc_cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages-meta`
--
ALTER TABLE `pages-meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sites-pages`
--
ALTER TABLE `sites-pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user-security_questions`
--
ALTER TABLE `user-security_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `useragents`
--
ALTER TABLE `useragents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users-auth_levels`
--
ALTER TABLE `users-auth_levels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users-groups`
--
ALTER TABLE `users-groups`
  ADD PRIMARY KEY (`user-id`);

--
-- Indexes for table `widgets`
--
ALTER TABLE `widgets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `301s`
--
ALTER TABLE `301s`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `cache`
--
ALTER TABLE `cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `content_attachment-meta`
--
ALTER TABLE `content_attachment-meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `content_attachment-meta-meta`
--
ALTER TABLE `content_attachment-meta-meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `content_attachments`
--
ALTER TABLE `content_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `content_types`
--
ALTER TABLE `content_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `dirs`
--
ALTER TABLE `dirs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `loc_cities`
--
ALTER TABLE `loc_cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=578;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `pages-meta`
--
ALTER TABLE `pages-meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `sites-pages`
--
ALTER TABLE `sites-pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `themes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user-security_questions`
--
ALTER TABLE `user-security_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `useragents`
--
ALTER TABLE `useragents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users-auth_levels`
--
ALTER TABLE `users-auth_levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `widgets`
--
ALTER TABLE `widgets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
