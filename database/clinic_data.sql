/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table clinic_data.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table clinic_data.admin: ~0 rows (approximately)
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` (`username`, `password`, `email`) VALUES
	('mousumi', '4312', 'mousumi@gmail.com');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

-- Dumping structure for table clinic_data.appointment
CREATE TABLE IF NOT EXISTS `appointment` (
  `doc_last_name` varchar(45) NOT NULL,
  `patient_last_name` varchar(45) NOT NULL,
  `contact_num` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `appointment_date` date DEFAULT NULL,
  `patient_first_name` varchar(45) DEFAULT NULL,
  `service_name` varchar(50) NOT NULL,
  PRIMARY KEY (`patient_last_name`),
  KEY `doc_name` (`doc_last_name`),
  KEY `appointment_date` (`appointment_date`),
  CONSTRAINT `appointment_date` FOREIGN KEY (`appointment_date`) REFERENCES `record` (`appointment_date`),
  CONSTRAINT `doc_name` FOREIGN KEY (`doc_last_name`) REFERENCES `employee` (`last_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.appointment: ~0 rows (approximately)
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;

-- Dumping structure for table clinic_data.bill
CREATE TABLE IF NOT EXISTS `bill` (
  `bill_num` int NOT NULL,
  `invoice_num` int NOT NULL,
  `medicine_ID` int NOT NULL,
  `total_price` decimal(2,0) NOT NULL,
  `covered_amount` decimal(2,0) NOT NULL,
  `customer_price` decimal(2,0) NOT NULL,
  PRIMARY KEY (`bill_num`),
  KEY `FK1_invoice_bill` (`invoice_num`),
  CONSTRAINT `FK1_invoice_bill` FOREIGN KEY (`invoice_num`) REFERENCES `invoices` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.bill: ~0 rows (approximately)
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
INSERT INTO `bill` (`bill_num`, `invoice_num`, `medicine_ID`, `total_price`, `covered_amount`, `customer_price`) VALUES
	(1, 2, 1, 6, 4, 2),
	(2, 2, 28, 43, 23, 20),
	(3, 2, 9, 6, 5, 1),
	(4, 1, 6, 15, 10, 5),
	(5, 1, 8, 24, 9, 15),
	(6, 1, 10, 20, 15, 5);
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;

-- Dumping structure for table clinic_data.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `EID` int NOT NULL,
  `salary` int DEFAULT NULL,
  `email_addr` varchar(255) DEFAULT NULL,
  `sex` varchar(1) DEFAULT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `contact_num` int DEFAULT NULL,
  `field` varchar(45) NOT NULL,
  PRIMARY KEY (`EID`,`first_name`,`last_name`),
  UNIQUE KEY `EID_UNIQUE` (`EID`),
  UNIQUE KEY `email_addr` (`email_addr`),
  KEY `employee_firstname` (`first_name`),
  KEY `employee_lastname` (`last_name`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`email_addr`) REFERENCES `login` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.employee: ~0 rows (approximately)
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;

-- Dumping structure for table clinic_data.invoices
CREATE TABLE IF NOT EXISTS `invoices` (
  `invoice_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `invoice_date` datetime NOT NULL,
  `Notes` varchar(200) NOT NULL,
  `isPaid` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table clinic_data.invoices: ~0 rows (approximately)
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` (`invoice_id`, `patient_id`, `invoice_date`, `Notes`, `isPaid`) VALUES
	(1, 1, '2022-11-12 18:30:54', 'Online order', 0),
	(2, 2, '2022-11-12 18:31:19', 'In store', 0);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;

-- Dumping structure for table clinic_data.login
CREATE TABLE IF NOT EXISTS `login` (
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.login: ~5 rows (approximately)
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` (`username`, `password`, `email`) VALUES
	('', '', ''),
	('34', '13', 'al@aol.com'),
	('alex', 'alex', 'example@login.com'),
	('mousumi', '1234', 'mousumi@gmail.com'),
	('muszyn', '2', 'alexander.muszynski@gmail.com'),
	('yariq', '1234', 'yariq@ex.com');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;

-- Dumping structure for table clinic_data.medicine
CREATE TABLE IF NOT EXISTS `medicine` (
  `medicine_ID` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `price` decimal(2,0) NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`medicine_ID`),
  UNIQUE KEY `code_UNIQUE` (`medicine_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.medicine: ~0 rows (approximately)
/*!40000 ALTER TABLE `medicine` DISABLE KEYS */;
INSERT INTO `medicine` (`medicine_ID`, `Name`, `price`, `quantity`) VALUES
	(1, 'Tylenol', 6, 30),
	(2, 'Losartan', 12, 30),
	(3, 'Amoldipin', 17, 30),
	(4, 'Losartan', 8, 30),
	(5, 'Valsartan', 22, 30),
	(6, 'Metformin', 15, 30),
	(7, 'Sertraline', 10, 30),
	(8, 'Bupropion', 24, 30),
	(9, 'Aspirin', 6, 30),
	(10, 'Meloxican', 20, 30),
	(11, 'Tramadol', 10, 30),
	(12, 'Amoxicilin', 15, 30),
	(13, 'Duloxetine', 30, 30),
	(14, 'Fluoxetine', 20, 30),
	(15, 'Famotidine', 5, 30),
	(16, 'Zolpidem', 14, 30),
	(17, 'Doxycycline', 15, 30),
	(18, 'Trazodone', 10, 30),
	(19, 'Levothyroxine', 33, 30),
	(20, 'Furosemide', 50, 30),
	(21, 'Rosuvastatin', 45, 30),
	(22, 'Ambien', 41, 30),
	(23, 'Omeprazole', 11, 30),
	(24, 'Montelukast', 12, 30),
	(25, 'Tamsulosin', 12, 30),
	(26, 'Insulin Detemir', 23, 30),
	(27, 'Sumatriptan', 12, 30),
	(28, 'Naproxen', 43, 30),
	(29, 'Rivaroxaban', 55, 30);
/*!40000 ALTER TABLE `medicine` ENABLE KEYS */;

-- Dumping structure for table clinic_data.patient
CREATE TABLE IF NOT EXISTS `patient` (
  `PID` int NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `contact_num` varchar(50) NOT NULL,
  `address` varchar(45) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(2) DEFAULT NULL,
  `zip_code` int DEFAULT NULL,
  `email_addr` varchar(255) DEFAULT NULL,
  `sex` varchar(1) NOT NULL,
  PRIMARY KEY (`PID`),
  UNIQUE KEY `PID_UNIQUE` (`PID`),
  UNIQUE KEY `email_addr` (`email_addr`),
  CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`email_addr`) REFERENCES `login` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.patient: ~0 rows (approximately)
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` (`PID`, `first_name`, `last_name`, `contact_num`, `address`, `city`, `state`, `zip_code`, `email_addr`, `sex`) VALUES
	(1, 'Alex', 'Hales', '31356883621', NULL, NULL, NULL, NULL, 'mousumi@gmail.com', 'M'),
	(2, 'Yariq', 'Hasan', '2485895623', '44 Hard drive', 'Auburn Hills', 'MI', 48326, 'yariq@ex.com', 'M');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;

-- Dumping structure for table clinic_data.processed_payment
CREATE TABLE IF NOT EXISTS `processed_payment` (
  `confirm_code` varchar(10) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `billing_name` varchar(50) NOT NULL,
  `patient_name` varchar(50) NOT NULL,
  `cardnumber` varchar(50) NOT NULL,
  `exp_year` int NOT NULL,
  `exp_month` int NOT NULL,
  `cvv` int NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `date` datetime NOT NULL,
  `billing_email` varchar(50) NOT NULL,
  `patient_email` varchar(50) NOT NULL,
  PRIMARY KEY (`confirm_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table clinic_data.processed_payment: ~0 rows (approximately)
/*!40000 ALTER TABLE `processed_payment` DISABLE KEYS */;
INSERT INTO `processed_payment` (`confirm_code`, `amount`, `billing_name`, `patient_name`, `cardnumber`, `exp_year`, `exp_month`, `cvv`, `address`, `city`, `state`, `zip`, `date`, `billing_email`, `patient_email`) VALUES
	('0YB694CJ', 23.00, 'adsfasd', 'asdf', '155656313676865', 2024, 4, 1252, 'faed', 'adsfa', 'dafs', '15252', '2022-11-13 02:24:48', 'yariq@ex.com', 'yariq@ex.com'),
	('A8VNK5YR', 23.00, 'John Cena', 'John Doe', '14552335233245', 2023, 5, 455, '22 Bull drive', 'Troy', 'MI', '', '2022-11-13 02:06:55', 'yariq@ex.com', 'yariq@ex.com'),
	('CEBTRZOB', 23.00, 'John Doe', 'John Doe', '1245454525565658', 2024, 4, 132, '12 Brian Ave', 'Troy', 'MI', '48302', '2022-11-13 02:19:02', 'yariq@ex.com', 'yariq@ex.com'),
	('E3Q2MCB6', 23.00, 'John Cena', 'John Cena', '12667989898', 2025, 4, 122, '12 Rose Circle', 'Troy', 'MI', '48309', '2022-11-13 02:13:24', 'yariq@ex.com', 'yariq@ex.com'),
	('HQLSP7LQ', 23.00, 'John Cena', 'John Cena', '1235545625852565', 2025, 6, 788, '33 Arntonie Dr', 'Troy', 'MI', '48309', '2022-11-13 02:16:33', 'yariq@ex.com', 'yariq@ex.com'),
	('J3S9XRHQ', 23.00, 'John Doe', 'John Doe', '1245454525565658', 2024, 4, 132, '12 Brian Ave', 'Troy', 'MI', '48302', '2022-11-13 02:19:53', 'yariq@ex.com', 'yariq@ex.com'),
	('OCMA2T4N', 23.00, 'asfd', 'asdf', '58653235+69+9685', 2024, 3, 555, 'asdf', 'dasf', 'asdf', '2121', '2022-11-13 02:35:15', 'yariq@ex.comasdf', 'yariq@ex.com'),
	('TBKO2NAH', 23.00, 'John Cena', 'John Cena', '4555225555655855', 2024, 2, 455, '45 Rocse Cad', 'Troy', 'MI', '48309', '2022-11-13 02:09:18', 'yariq@ex.com', 'yariq@ex.com'),
	('YAW59JY5', 23.00, 'John Doe', 'John Doe', '1245454525565658', 2024, 4, 132, '12 Brian Ave', 'Troy', 'MI', '48302', '2022-11-13 02:20:16', 'yariq@ex.com', 'yariq@ex.com'),
	('Z3D7HZW4', 23.00, 'John Cena', 'John Cena', '1235545625852565', 2025, 6, 788, '33 Arntonie Dr', 'Troy', 'MI', '48309', '2022-11-13 02:17:40', 'yariq@ex.com', 'yariq@ex.com');
/*!40000 ALTER TABLE `processed_payment` ENABLE KEYS */;

-- Dumping structure for table clinic_data.record
CREATE TABLE IF NOT EXISTS `record` (
  `record_num` int NOT NULL,
  `appointment_date` date DEFAULT NULL,
  `description` longtext,
  `patient_id` int DEFAULT NULL,
  PRIMARY KEY (`record_num`),
  UNIQUE KEY `record_num_UNIQUE` (`record_num`),
  KEY `record_patientid_idx` (`patient_id`),
  KEY `appointment_date` (`appointment_date`),
  CONSTRAINT `record_patientid` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`PID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.record: ~0 rows (approximately)
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
/*!40000 ALTER TABLE `record` ENABLE KEYS */;

-- Dumping structure for table clinic_data.rooms
CREATE TABLE IF NOT EXISTS `rooms` (
  `rooms_id` int NOT NULL,
  `room_type` varchar(45) NOT NULL,
  `time_period` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`rooms_id`),
  UNIQUE KEY `rooms_id_UNIQUE` (`rooms_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.rooms: ~0 rows (approximately)
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;

-- Dumping structure for table clinic_data.services
CREATE TABLE IF NOT EXISTS `services` (
  `service_name` varchar(50) NOT NULL,
  `service_price` int DEFAULT NULL,
  `rooms_rooms_id` int NOT NULL,
  `service_ID` int NOT NULL,
  PRIMARY KEY (`service_name`),
  UNIQUE KEY `service_ID` (`service_ID`),
  KEY `fk_services_rooms1_idx` (`rooms_rooms_id`),
  CONSTRAINT `fk_services_rooms1` FOREIGN KEY (`rooms_rooms_id`) REFERENCES `rooms` (`rooms_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table clinic_data.services: ~0 rows (approximately)
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
