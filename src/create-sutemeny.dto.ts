import { IsBoolean, IsInt, IsNotEmpty, IsString, IsIn } from "class-validator";

export class CreateSutemenyDto {
    @IsString()
    @IsNotEmpty({ message: 'A nevet kötelező megadni!'})
    name: string;

    @IsBoolean()
    laktozMentes: boolean;

    @IsInt()
    db: number;

    // @IsIn(['torta', 'fagylalt', 'édesség'])
    // tipus: string;
}