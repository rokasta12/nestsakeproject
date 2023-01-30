import { Module } from "@nestjs/common";
import { TypedConfigModule, fileLoader } from "nest-typed-config";
import { Config } from "./config.schema";

@Module({
    imports: [
        TypedConfigModule.forRoot({
            schema: Config,
            load: fileLoader({
                absolutePath: process.cwd() + "/config.toml",
            }),
        }),
    ],
    providers: [],
})
export class ConfigModule {}
