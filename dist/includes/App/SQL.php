<?php
/**
 *  includes/SQL.php
 */
namespace App;

Class SQL {

	private $servername;
	private $username;
	private $password;
	private $dbname;
	protected $conn;

	function __construct($params = null) {

		$this->servername = Config::$servername;
		$this->username = Config::$username;
		$this->password = Config::$password;
		$this->dbname = Config::$dbname;

		$defaults = ['servername','dbname','username','password'];
		foreach ($defaults as $default) {
			$$default = isset($params[$default]) ? $params[$default] : $this->$default;
		}
		try {
			$this->conn = new \PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			$this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		} catch(\PDOException $e) {
			return ['succeeded' => false, 'message' => 'Connection error.', 'details' => $e->getMessage()];
		}

	}
	
	public function insert($table, $valueArray) {
		$sql = 'INSERT INTO ' . $table . ' (';
		$values = 'VALUES (';
		foreach ($valueArray as $key => $value) {
			$sql .= $key . ', ';
			$values .= ':' . $key . ', ';
		}
		$sql = substr($sql, 0, -2) . ')' . PHP_EOL . substr($values, 0, -2) . ')';
		$sql = $this->conn->prepare($sql);
		foreach ($valueArray as $key => $value) {
			switch(gettype($value)) {
				case 'boolean':
					$data_type = \PDO::PARAM_BOOL;
					break;
				case 'integer':
					$data_type = \PDO::PARAM_NULL;
					break;
				case 'double':
					$data_type = \PDO::PARAM_INT;
					break;
				default: \PDO::PARAM_STR;
			}
			$sql->bindValue(':' . $key, $valueArray[$key], $data_type);
		}
		try {
			$result = $sql->execute();
			return ['succeeded' => true, 'message' => 'Insert succeeded.'];
		} catch(\PDOException $e) {
			return ['succeeded' => false, 'message' => 'Insert failed.', 'details' => $e->getMessage()];
		}
	}
}
?>