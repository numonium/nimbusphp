<?php
	/* juniper/lib/loc/states: lists of US states and Canadian provinces
			* probably should move to db *
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
		
	$_['loc']['states'] = array();
	
	$_['loc']['states']["AL"] = "Alabama";
	$_['loc']['states']["AK"] = "Alaska";
	$_['loc']['states']["AZ"] = "Arizona";
	$_['loc']['states']["AR"] = "Arkansas";
	$_['loc']['states']["CA"] = "California";
	$_['loc']['states']["CO"] = "Colorado";
	$_['loc']['states']["CT"] = "Connecticut";
	$_['loc']['states']["DE"] = "Delaware";
	$_['loc']['states']["DC"] = "District of Columbia";
	$_['loc']['states']["FL"] = "Florida";
	$_['loc']['states']["GA"] = "Georgia";
	$_['loc']['states']["HI"] = "Hawaii";
	$_['loc']['states']["ID"] = "Idaho";
	$_['loc']['states']["IL"] = "Illinois";
	$_['loc']['states']["IN"] = "Indiana";
	$_['loc']['states']["IA"] = "Iowa";
	$_['loc']['states']["KS"] = "Kansas";
	$_['loc']['states']["KY"] = "Kentucky";
	$_['loc']['states']["LA"] = "Louisiana";
	$_['loc']['states']["ME"] = "Maine";
	$_['loc']['states']["MD"] = "Maryland";
	$_['loc']['states']["MA"] = "Massachusetts";
	$_['loc']['states']["MI"] = "Michigan";
	$_['loc']['states']["MN"] = "Minnesota";
	$_['loc']['states']["MS"] = "Mississippi";
	$_['loc']['states']["MO"] = "Missouri";
	$_['loc']['states']["MT"] = "Montana";
	$_['loc']['states']["NE"] = "Nebraska";
	$_['loc']['states']["NV"] = "Nevada";
	$_['loc']['states']["NH"] = "New Hampshire";
	$_['loc']['states']["NJ"] = "New Jersey";
	$_['loc']['states']["NM"] = "New Mexico";
	$_['loc']['states']["NY"] = "New York";
	$_['loc']['states']["NC"] = "North Carolina";
	$_['loc']['states']["ND"] = "North Dakota";
	$_['loc']['states']["OH"] = "Ohio";
	$_['loc']['states']["OK"] = "Oklahoma";
	$_['loc']['states']["OR"] = "Oregon";
	$_['loc']['states']["PA"] = "Pennsylvania";
	$_['loc']['states']["RI"] = "Rhode Island";
	$_['loc']['states']["SC"] = "South Carolina";
	$_['loc']['states']["SD"] = "South Dakota";
	$_['loc']['states']["TN"] = "Tennessee";
	$_['loc']['states']["TX"] = "Texas";
	$_['loc']['states']["UT"] = "Utah";
	$_['loc']['states']["VT"] = "Vermont";
	$_['loc']['states']["VA"] = "Virginia";
	$_['loc']['states']["WA"] = "Washington";
	$_['loc']['states']["WV"] = "West Virginia";
	$_['loc']['states']["WI"] = "Wisconsin";
	$_['loc']['states']["WY"] = "Wyoming";
	
	
	/* ~EN: see http://en.wikipedia.org/wiki/List_of_IOC_country_codes */
	
	/* < USA */
	
	$_['loc']['country']['USA']['states']=$_['loc']['states'];
	
	/* USA /> */
	
	/* < Canada */
	
	/* 		Alberta		AB			
	British Columbia		BC			
	Manitoba		MB			
	New Brunswick		NB			
	Newfoundland and Labrador		NL			
	Northwest Territories		NT			
	Nova Scotia		NS			
	Nunavut		NU			
	Ontario		ON			
	Prince Edward Island		PE			
	Quebec		QC			
	Saskatchewan		SK			
	Yukon		YT*/
	
	$_['loc']['country']['CAN']['states']['AB'] = "Alberta";
	$_['loc']['country']['CAN']['states']['BC'] = "British Columbia";
	$_['loc']['country']['CAN']['states']['MB'] = "Manitoba";
	$_['loc']['country']['CAN']['states']['NB'] = "New Brunswick";
	$_['loc']['country']['CAN']['states']['NL'] = "Newfoundland & Labrador";
	$_['loc']['country']['CAN']['states']['NT'] = "Northwest Territories";
	$_['loc']['country']['CAN']['states']['NS'] = "Nova Scotia";
	$_['loc']['country']['CAN']['states']['NU'] = "Nunavut";
	$_['loc']['country']['CAN']['states']['ON'] = "Ontario";
	$_['loc']['country']['CAN']['states']['PE'] = "Prince Edward Island";
	$_['loc']['country']['CAN']['states']['QC'] = "Quebec";
	$_['loc']['country']['CAN']['states']['SK'] = "Saskatchewan";
	$_['loc']['country']['CAN']['states']['YT'] = "Yukon";
	
	/* Canada /> */
	
	function state_old_abbr($state){
		$abbr = array(
			'AL'	=> 'Aba',
			'AZ'	=> 'Ariz',
			'AR'	=> 'Ark',
			'CA'	=> 'Calif',
			'CO'	=> 'Colo',
			'CT'	=> 'Conn',
			'DC'	=> 'D.C',
			'DE'	=> 'Del',
			'FL'	=> 'Fla',
			'GA'	=> 'Ga',
			'IL'	=> 'Ill',
			'IN'	=> 'Ind',
			'IA'	=> array( 'Iowa', 'full' => true ),
			'KS'	=> 'Kan',
			'KY'	=> 'Ky',
			'LA'	=> 'La',
			'ME'	=> array( 'Maine', 'full' => true ),
			'MD'	=> 'Md',
			'MA'	=> 'Mass',
			'MI'	=> 'Mich',
			'MN'	=> 'Minn',
			'MS'	=> 'Miss',
			'MO'	=> 'Mo',
			'MT'	=> 'Mont',
			'NE'	=> 'Nebr',
			'NV'	=> 'Nev',
			'NH'	=> 'N.H',
			'NJ'	=> 'N.J',
			'NM'	=> 'N. Mex',
			'NY'	=> 'N.Y',
			'ND'	=> 'N. Dak',
			'OH'	=> array( 'Ohio', 'full' => true ),
			'OK'	=> 'Okla',
			'OR'	=> 'Oreg',
			'PA'	=> 'Penn',
			'RI'	=> 'R.I',
			'SC'	=> 'S.C',
			'SD'	=> 'S. Dak',
			'TN'	=> 'Tenn',
			'TX'	=> 'Tex',
			'UT'	=> array( 'Utah', 'full' => true ),
			'VT'	=> 'Vt',
			'VA'	=> 'Va',
			'WA'	=> 'Wash',
			'WV'	=> 'W. Va',
			'WI'	=> 'Wis',
			'WY'	=> 'Wyo'
		);
		
		if(!empty($abbr[$state]))
			return (is_array($abbr[$state]) ? $abbr[$state][0] : $abbr[$state]).(!is_array($abbr[$state]) || (is_array($abbr[$state]) && empty($abbr[$state]['full'])) ? '.' : '');
		
		return $state;
	}

?>