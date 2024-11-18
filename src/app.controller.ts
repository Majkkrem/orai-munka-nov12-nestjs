import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Sutemeny } from './sutemeny';
import { CreateSutemenyDto } from './create-sutemeny.dto';
import { UpdateSutemenyDto } from './update-sutemeny.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  sutik: Sutemeny[] = [
    {
      id: 1,
      name: 'Tiramisu',
      laktozMentes: true,
      db: 5,
    },
    {
      id: 2,
      name: 'Dobostorta',
      laktozMentes: false,
      db: 3,
    },
    {
      id: 4,
      name: 'Krémes',
      laktozMentes: false,
      db: 2,
    },
  ];
  nextID = 5;

  @Get('sutik')
  sutemenyekListazasa() {
    return this.sutik
  }

  @Get('sutik/:sutiid')
  sutemennyIDAlapjan(@Param('sutiid') id: string) {
    const idSzam = parseInt(id);
    const suti = this.sutik.find(suti => suti.id == idSzam);
    if (!suti) {
      throw new NotFoundException('Nincs ilyen süti');
    }
    return suti;
  }

  @Delete('sutik/:sutiid')
  @HttpCode(204)
  sutiTorles(@Param('sutiid') id: string) {
    const idSzam = parseInt(id);
    const idx = this.sutik.findIndex(suti => suti.id == idSzam);
    if (idx === -1) {
      throw new NotFoundException('Nincs ilyen ID-jű süti');
    }
    this.sutik.splice(idx);
    

    //this.sutik = this.sutik.filter(suti => suti.id !== idSzam);
    //this.sutik[idSzam] = null;
  }

  @Get('sutiKereses')
  sutemenyKereses(@Query('kereses') kereses?: string) {
    if (!kereses) {
      return this.sutik;
    }
    return this.sutik.filter(suti => suti.name.toLocaleLowerCase().includes(kereses.toLocaleLowerCase()));
  }
  //   const keresett : string[] = [];
  //   for (const suti of this.sutik){
  //     if (suti.includes(kereses)){
  //       keresett.push(suti);
  //     }
  //   }
  //   return keresett;
  // }

  @Post('ujSuti')
  ujSuti(@Body() ujSutiAdatok: CreateSutemenyDto) {
    const ujSutemeny: Sutemeny = {
      id: this.nextID,
      name: ujSutiAdatok.name,
      laktozMentes: ujSutiAdatok.laktozMentes,
      db: ujSutiAdatok.db,
    }
    this.nextID++;
    this.sutik.push(ujSutemeny);
    return ujSutemeny;
  }
  @Patch('sutiModositas/:sutiid')
  sutiModositas(@Param('sutiid') id: string, @Body() sutiAdatok: UpdateSutemenyDto) {
    const idSzam = parseInt(id);
    const eredetiSutiID = this.sutik.findIndex(suti => suti.id == idSzam);
    const eredetiSuti = this.sutik[eredetiSutiID];
    if (eredetiSutiID === -1) {
      throw new NotFoundException('Nincs ilyen ID-jű süti');
    }

    if (typeof sutiAdatok.name !== 'number') {

      throw new BadRequestException('A darab típusa number kell legyen');
    }
    if (sutiAdatok.db < 0) {
      throw new BadRequestException('A darab nem lehet negatív');
    }

    const ujSuti: Sutemeny = {
      ...eredetiSuti,
      ...sutiAdatok,
    };
    this.sutik[eredetiSutiID] = ujSuti;
    return ujSuti;
  }

  // Házi feladat

  @Get('abcsorrend')
  //sort helyett Array.from() vagy toSorted()
  abcSorrend() {
  const sutikABC = Array.from(this.sutik).sort((a, b) => a.name.localeCompare(b.name));
  return sutikABC;
  }


  @Get('keszleten')
  //Ahol a dbszám nagyobb mint 0
  keszleten() {
    return this.sutik.filter(suti => suti.db > 0);
  }

  @Post('ujSutiGyors')
  //csak a nevet kell megadni a db 1 a laktózmentes false
  ujSutiGyors(@Body('name') name: string) {
    if (typeof name !== 'string' || name.trim() === "") {
      throw new BadRequestException('A név megadása kötelező');

    }
    const ujSutemeny: Sutemeny = {
      id: this.nextID,
      name: name,
      laktozMentes: false,
      db: 1,
    }
    this.nextID++;
    this.sutik.push(ujSutemeny);
    return ujSutemeny;
  }


}
