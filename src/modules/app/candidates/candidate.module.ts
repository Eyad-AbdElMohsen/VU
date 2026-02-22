import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CandidateService } from "./services/candidate.service";
import { CandidateController } from "./controllers/candidate.controller";
import { Candidate } from "./entities/candidate.entity";
import { User } from "../auth-base/user/entities/user.entity";
import { CandidateQuestion } from "./entities/candidate-question.entity";
import { CandidateCvAnalysis } from "./entities/candidate-cv-analysis.entity";
import { CandidatePerformance } from "./entities/candidate-performance.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Candidate, CandidateQuestion, CandidateCvAnalysis, CandidatePerformance, User])],
    providers: [CandidateService],
    controllers: [CandidateController],
    exports: [CandidateService],
})
export class CandidateModule {}