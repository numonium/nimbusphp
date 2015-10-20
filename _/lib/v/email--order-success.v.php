<?php
	/* _/lib/v/email--forgot-pw - HTML email view for "forgot password" form
		nimbus (c) 2012+ numonium //c */
		
	$_const = array(
		'email'	=> array(
			'h1'	=> "font-family: 'century gothic','URW Gothic L',trebuchet ms,trebuchet,arial,sans-serif; font-size:24px; text-align:center;",
			'table-bg'	=> "width:745px; background-color:#98dae6; border:solid 1px #cbcbcb; font-family: 'century gothic','URW Gothic L',trebuchet ms,trebuchet,arial,sans-serif; text-align:center; font-size:16px; color:#333;"
		)
	);
	
	foreach($cfg['orders'] as $okey => $order){
		$cfg['orders'][$okey] = new _Order(array(
			FETCH_FROM_DB => true,
			'id'	=> $order
		));
	} ?>
		
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<title>Sun & Fun Media - Forgot Password</title>
</head>
<body>
	<table width="745" cellpadding="0" cellspacing="0" align="center" style="<?php echo $_const['email']['table-bg']; ?>">
		<tr>
			<td>
				<img src="http://<?php echo $_['server']['http-host']; ?>/design/img/email/email-banner-745x150.jpg" alt="">	
			</td>
		</tr>
		<tr>
			<td>
				<h1><strong><?php echo count($cfg['orders']); ?></strong> <?php echo units(count($cfg['orders']),'Certificate'); ?> Ordered</h1>
					
				<h2>Order Details:</h2>
				
				<table cellpadding="3" cellspacing="0" align="center" width="80%">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Rate</th>
							<th>Qty</th>
							<th>Order Time</th>
						</tr>
					</thead>
					<tbody><?php
						
						foreach($cfg['orders'] as $okey => $order){ ?>
													
							<tr>
								<th><?php echo $order->id; ?></td>
								<td><?php echo $order->vacation->name; ?></td>
								<td><?php echo $order->rate; ?></td>
								<td><?php echo $order->qty; ?></td>
								<td><?php echo $order->order_date(); ?></td>
							</tr><?php
							
						} ?>
											
					</tbody>
				</table>
				
				<h2>Ordered By:</h2>
				<p><?php echo $_['user']['user']->full_name(); ?> &mdash; <?php echo $_['user']['user']->station->name; ?> (<?php echo $_['user']['user']->station->call_letters; ?>)</p>

			</td>
		</tr>
	</table>
</body>
</html>