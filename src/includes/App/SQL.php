<?php
/**
 *  includes/SQL.php
 */
namespace App;

Class SQL {

	private $dsn;
	private $host;
	private $port;
	private $username;
	private $password;
	private $name;
	private $schema;
	protected $conn;

	function __construct($params = null) {

		$properties = ['dsn', 'host', 'port', 'name', 'username','password', 'schema', 'options'];

		foreach ($properties as $property) {
			if (isset($params[$property])) $$property = $this->$property = $params[$property];
			else $$property = $this->$property = empty(Config::$db[$property]) ? null : Config::$db[$property];
		}
		try {
			switch ($dsn) {
				case 'mysql':
					$this->conn = new \PDO("$dsn:host=$host;port=$port;dbname=$name;user=$username;password=$password", $options);
					break;
				case 'pgsql':
					$this->conn = new \PDO("$dsn:host=$host;port=$port;dbname=$name;", $username, $password, $options);
					break;
			}
			$this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		} catch(\PDOException $e) {
			throw new \Exception($e->getMessage());
		}

	}
	
	public function insert($schema, $table, $valueArray = null) {
		// Allow for unspecified schema
		if (empty($valueArray)) {
			$valueArray = $table;
			$table = $schema;
			$schema = $this->schema;
		}
		
		$sql = 'INSERT INTO ' . $schema . '.' . $table . ' (';
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
					$data_type = \PDO::PARAM_INT;
					break;
				case 'double':
					$data_type = \PDO::PARAM_INT;
					break;
				default: $data_type = \PDO::PARAM_STR;
			}
			$sql->bindValue(':' . $key, $valueArray[$key], $data_type);
		}
		try {
			$result = $sql->execute();
			return ['succeeded' => true, 'message' => 'Insert succeeded.'];
		} catch(\PDOException $e) {
			error_log($e);
			return ['succeeded' => false, 'message' => 'Insert failed.', 'details' => $e->getMessage()];
		}
	}
}
?>