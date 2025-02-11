import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './project.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Project])
    ],
    providers: [ProjectsService],
    controllers: [ProjectsController],
    exports: [ProjectsService]
})
export class ProjectsModule {}