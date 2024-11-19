import { IsInt, Min } from "class-validator";

export class UpdateSutemenyDto {
    name?: string;
    laktozMentes?: boolean;

    @IsInt()
    @Min(0)
    db?: number;
}