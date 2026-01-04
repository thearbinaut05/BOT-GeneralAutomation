import { useState } from 'react';
import { 
  validatePrivateKey, 
  convertKey, 
  privateKeyToAddress,
  privateKeyToPublicKey,
  decimalToHex
} from '../utils/crypto';

export default function KeyConverter() {
  const [inputFormat, setInputFormat] = useState('hex');
  const [inputKey, setInputKey] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  const handleConvert = () => {
    setError('');
    setResults(null);

    if (!inputKey.trim()) {
      setError('Please enter a private key');
      return;
    }

    // Validate input
    if (!validatePrivateKey(inputKey.trim(), inputFormat)) {
      setError(`Invalid ${inputFormat} format private key`);
      return;
    }

    try {
      const hex = convertKey(inputKey.trim(), inputFormat, 'hex');
      const decimal = convertKey(inputKey.trim(), inputFormat, 'decimal');
      const wif = convertKey(inputKey.trim(), inputFormat, 'wif');
      const binary = convertKey(inputKey.trim(), inputFormat, 'binary');
      const address = privateKeyToAddress(hex);
      const publicKey = privateKeyToPublicKey(hex);

      setResults({
        hex,
        decimal,
        wif,
        binary,
        address,
        publicKey
      });
    } catch (err) {
      setError('Error converting key: ' + err.message);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-bitcoin-orange mb-6">Private Key Converter & Validator</h2>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Input Format</label>
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            className="w-full px-4 py-2 bg-bitcoin-gray border border-bitcoin-orange/30 rounded-lg text-white focus:outline-none focus:border-bitcoin-orange"
          >
            <option value="hex">Hexadecimal</option>
            <option value="decimal">Decimal</option>
            <option value="wif">WIF (Wallet Import Format)</option>
            <option value="binary">Binary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Private Key</label>
          <textarea
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder={`Enter private key in ${inputFormat} format...`}
            className="w-full px-4 py-2 bg-bitcoin-gray border border-bitcoin-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin-orange font-mono text-sm"
            rows="3"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleConvert}
          className="w-full px-6 py-3 bg-bitcoin-orange hover:bg-bitcoin-orange/80 text-black font-bold rounded-lg transition-colors"
        >
          Convert & Validate
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-4 border-t border-bitcoin-orange/30 pt-6">
          <h3 className="text-lg font-semibold text-bitcoin-orange mb-4">Conversion Results</h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">Decimal:</span>
              <button
                onClick={() => copyToClipboard(results.decimal, 'decimal')}
                className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
              >
                {copiedField === 'decimal' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-bitcoin-gray p-3 rounded font-mono text-sm break-all">
              {results.decimal}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">Hexadecimal:</span>
              <button
                onClick={() => copyToClipboard(results.hex, 'hex')}
                className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
              >
                {copiedField === 'hex' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-bitcoin-gray p-3 rounded font-mono text-sm break-all">
              {results.hex}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">WIF (Wallet Import Format):</span>
              <button
                onClick={() => copyToClipboard(results.wif, 'wif')}
                className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
              >
                {copiedField === 'wif' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-bitcoin-gray p-3 rounded font-mono text-sm break-all">
              {results.wif}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-sm">Binary:</span>
              <button
                onClick={() => copyToClipboard(results.binary, 'binary')}
                className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
              >
                {copiedField === 'binary' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-bitcoin-gray p-3 rounded font-mono text-xs break-all max-h-32 overflow-y-auto scrollbar-thin">
              {results.binary}
            </div>
          </div>

          <div className="border-t border-bitcoin-orange/30 pt-4 mt-4">
            <h4 className="text-md font-semibold text-bitcoin-orange mb-3">Derived Information</h4>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Bitcoin Address (P2PKH):</span>
                <button
                  onClick={() => copyToClipboard(results.address, 'address')}
                  className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                >
                  {copiedField === 'address' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-bitcoin-gray p-3 rounded font-mono text-sm break-all">
                {results.address}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Public Key (Compressed):</span>
                <button
                  onClick={() => copyToClipboard(results.publicKey, 'pubkey')}
                  className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                >
                  {copiedField === 'pubkey' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-bitcoin-gray p-3 rounded font-mono text-sm break-all">
                {results.publicKey}
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <div className="text-green-500 font-semibold">Valid Private Key</div>
                <div className="text-sm text-gray-400 mt-1">
                  This private key is valid and can be imported into Electrum or other Bitcoin wallets using the WIF format.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-bitcoin-gray rounded-lg text-sm text-gray-400">
        <h4 className="font-semibold text-white mb-2">How to use:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Select the format of your input private key</li>
          <li>Paste or enter the private key</li>
          <li>Click "Convert & Validate" to see all formats</li>
          <li>Use the WIF format to import into Electrum wallet</li>
        </ol>
      </div>
    </div>
  );
}
