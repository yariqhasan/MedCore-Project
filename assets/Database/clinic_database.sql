-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema clinic_database
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema clinic_database
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `clinic_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `clinic_database` ;

-- -----------------------------------------------------
-- Table `clinic_database`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`admin` (
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`email`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`employee` (
  `EID` INT NOT NULL,
  `salary` INT NULL DEFAULT NULL,
  `email_addr` VARCHAR(45) NULL DEFAULT NULL,
  `sex` VARCHAR(1) NULL DEFAULT NULL,
  `doc_last_name` VARCHAR(45) NOT NULL,
  `doc_contact_num` INT NULL DEFAULT NULL,
  `field` VARCHAR(45) NOT NULL,
  `doc_first_name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`EID`, `doc_last_name`),
  UNIQUE INDEX `EID_UNIQUE` (`EID` ASC) INVISIBLE,
  INDEX `employee_lastname` (`doc_last_name` ASC) INVISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`rooms`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`rooms` (
  `rooms_id` INT NOT NULL,
  `room_type` VARCHAR(45) NOT NULL,
  `time_period` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`rooms_id`),
  UNIQUE INDEX `rooms_id_UNIQUE` (`rooms_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`services` (
  `service_name` VARCHAR(50) NOT NULL,
  `service_price` INT NULL DEFAULT NULL,
  `rooms_rooms_id` INT NOT NULL,
  PRIMARY KEY (`service_name`),
  INDEX `fk_services_rooms1_idx` (`rooms_rooms_id` ASC) VISIBLE,
  CONSTRAINT `fk_services_rooms1`
    FOREIGN KEY (`rooms_rooms_id`)
    REFERENCES `clinic_database`.`rooms` (`rooms_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`appointment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`appointment` (
  `appoint_num` INT NOT NULL,
  `patient_first_name` VARCHAR(45) NOT NULL,
  `patient_last_name` VARCHAR(45) NOT NULL,
  `contact_num` VARCHAR(45) NOT NULL,
  `appointment_date` DATE NOT NULL,
  `service_name` VARCHAR(50) NULL DEFAULT NULL,
  `doc_last_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`appoint_num`),
  UNIQUE INDEX `appointment_date_UNIQUE` (`appointment_date` ASC) VISIBLE,
  INDEX `service_name_idx` (`service_name` ASC) VISIBLE,
  INDEX `doc_name` (`doc_last_name` ASC) VISIBLE,
  INDEX `patient_ID_idx` (`appoint_num` ASC) VISIBLE,
  CONSTRAINT `doc_name`
    FOREIGN KEY (`doc_last_name`)
    REFERENCES `clinic_database`.`employee` (`doc_last_name`),
  CONSTRAINT `service_name`
    FOREIGN KEY (`service_name`)
    REFERENCES `clinic_database`.`services` (`service_name`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`invoices`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`invoices` (
  `invoice_id` INT NOT NULL,
  `patient_id` INT NOT NULL,
  `invoice_date` DATETIME NOT NULL,
  `Notes` VARCHAR(200) NOT NULL,
  `isPaid` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`invoice_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`bill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`bill` (
  `bill_num` INT NOT NULL,
  `invoice_num` INT NOT NULL,
  `medicine_ID` INT NOT NULL,
  `total_price` DECIMAL(2,0) NOT NULL,
  `covered_amount` DECIMAL(2,0) NOT NULL,
  `customer_price` DECIMAL(2,0) NOT NULL,
  PRIMARY KEY (`bill_num`),
  INDEX `FK1_invoice_bill` (`invoice_num` ASC) VISIBLE,
  CONSTRAINT `FK1_invoice_bill`
    FOREIGN KEY (`invoice_num`)
    REFERENCES `clinic_database`.`invoices` (`invoice_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `clinic_database`.`card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`card` (
  `card_num` INT NOT NULL,
  `exp_month` INT NOT NULL,
  `exp_year` VARCHAR(55) NOT NULL,
  `cvv_num` INT NOT NULL,
  `card_holder_name` VARCHAR(45) NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`login` (
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `clinic_database`.`medicine`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`medicine` (
  `medicine_ID` INT NOT NULL,
  `Name` VARCHAR(50) NOT NULL,
  `price` DECIMAL(2,0) NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`medicine_ID`),
  UNIQUE INDEX `code_UNIQUE` (`medicine_ID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `clinic_database`.`patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`patient` (
  `PID` INT NOT NULL,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `contact_num` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NULL DEFAULT NULL,
  `email_addr` VARCHAR(45) NULL DEFAULT NULL,
  `sex` VARCHAR(1) NOT NULL,
  PRIMARY KEY (`PID`),
  UNIQUE INDEX `PID_UNIQUE` (`PID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`patient_login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`patient_login` (
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`processed_payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`processed_payment` (
  `confirm_code` VARCHAR(10) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `billing_name` VARCHAR(50) NOT NULL,
  `patient_name` VARCHAR(50) NOT NULL,
  `card_name` VARCHAR(45) NOT NULL,
  `cardnumber` VARCHAR(50) NOT NULL,
  `exp_year` INT NOT NULL,
  `exp_month` INT NOT NULL,
  `cvv` INT NOT NULL,
  `address` VARCHAR(50) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `state` VARCHAR(50) NOT NULL,
  `zip` VARCHAR(10) NOT NULL,
  `date` DATE NOT NULL,
  `billing_email` VARCHAR(50) NOT NULL,
  `patient_email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`confirm_code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinic_database`.`record`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinic_database`.`record` (
  `record_num` INT NOT NULL,
  `appointment_date` DATE NULL DEFAULT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  `patient_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`record_num`),
  UNIQUE INDEX `record_num_UNIQUE` (`record_num` ASC) VISIBLE,
  INDEX `record_patientid_idx` (`patient_id` ASC) VISIBLE,
  INDEX `appointment_date_idx` (`appointment_date` ASC) VISIBLE,
  CONSTRAINT `appointment_date`
    FOREIGN KEY (`appointment_date`)
    REFERENCES `clinic_database`.`appointment` (`appointment_date`),
  CONSTRAINT `record_patientid`
    FOREIGN KEY (`patient_id`)
    REFERENCES `clinic_database`.`patient` (`PID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
