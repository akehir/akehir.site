# How to Setup the Built-In WireGuard VPN in ChromeOS

ChromeOS usually affords the setup of VPN connections via Android Apps. However I've found a better way for WireGuard VPN (and OpenVPN) connections: It is actually much easier to just use the built-in VPN. Here is my sample configuration which I've used to make a builtin WireGuard VPN Connection.

In order to enter the values, you have to go to Settings / Network / Add connection / Add built-in VPN...

| Field                         | Example Value                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Service Name                  | My VPN                                                                                                                                                                                                                               |
| Provider Type                 | WireGuard                                                                                                                                                                                                                            |
| Client IP Address             | 192.168.1.123                                                                                                                                                                                                                        |
| Name Servers                  | 192.168.1.1,0.0.0.0,0.0.0.0,0.0.0.0                                                                                                                                                                                                  |
| Key                           | Either "Generate Random Keypair" or "I have a Keypair"<br><br>*You'll need to check with your VPN provider if they provide a keypair, otherwise if you generate one here, you'll have to register the public key with your provider* |
| Peer - Public Key             | Enter the public key provided by your VPN provider.                                                                                                                                                                                  |
| Peer - Pre-Shared Key         | Enter, if you have one                                                                                                                                                                                                               |
| Endpoint                      | vpn.example.com:12345                                                                                                                                                                                                                |
| Allowed IPs                   | 0.0.0.0/0,::/0<br>*if only IPv4, use 0.0.0.0/0 and skip ,::/0*                                                                                                                                                                       |
| Persistent keepalive Interval | *empty*                                                                                                                                                                                                                              |

