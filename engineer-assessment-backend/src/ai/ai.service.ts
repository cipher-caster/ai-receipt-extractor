import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ExtractedReceipt } from './ai.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { OpenaiProvider } from './providers/openai.provider';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly providers: Map<string, AiProvider>;
  private readonly defaultProvider: string;

  constructor(
    private configService: ConfigService,
    private geminiProvider: GeminiProvider,
    private openaiProvider: OpenaiProvider,
  ) {
    this.providers = new Map<string, AiProvider>([
      ['gemini', this.geminiProvider],
      ['openai', this.openaiProvider],
    ]);

    this.defaultProvider = this.configService.get<string>(
      'AI_PROVIDER',
      'gemini',
    );
    this.logger.log(`Default AI provider: ${this.defaultProvider}`);
  }

  async extractReceipt(
    imageBuffer: Buffer,
    mimeType: string,
    providerName?: string,
  ): Promise<ExtractedReceipt> {
    const name = providerName || this.defaultProvider;
    const provider = this.providers.get(name);

    if (!provider) {
      throw new Error(`AI provider "${name}" not found`);
    }

    this.logger.log(`Extracting receipt using ${name} provider`);
    return provider.extractReceipt(imageBuffer, mimeType);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
