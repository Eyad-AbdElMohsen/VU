import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "../entities/company.entity";
import { Repository } from "typeorm";


@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private readonly companyRepo: Repository<Company>) { }
}