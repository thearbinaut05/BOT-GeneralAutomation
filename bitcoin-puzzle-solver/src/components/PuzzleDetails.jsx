import { useState } from 'react';
import { decimalToHex, privateKeyToWIF, privateKeyToAddress, privateKeyToPublicKey } from '../utils/crypto';

export default function PuzzleDetails({ puzzle, onClose }) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status) => {
    if (status === 'SOLVED') return 'text-green-500';
    if (status === 'PRIORITY TARGET') return 'text-bitcoin-orange';
    return 'text-red-500';
  };

  const privateKeyHex = puzzle.privateKey ? decimalToHex(puzzle.privateKey) : null;
  const privateKeyWIF = privateKeyHex ? privateKeyToWIF(privateKeyHex) : null;
  const address = privateKeyHex ? privateKeyToAddress(privateKeyHex) : null;
  const publicKey = privateKeyHex ? privateKeyToPublicKey(privateKeyHex) : null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 bg-bitcoin-dark border-b border-bitcoin-orange/30 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-bitcoin-orange">
              Puzzle #{puzzle.number}
            </h2>
            <p className={`text-sm font-semibold ${getStatusColor(puzzle.status)}`}>
              {puzzle.status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bitcoin-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Bit Length</div>
              <div className="text-xl font-bold text-bitcoin-orange">{puzzle.bitLength}</div>
            </div>
            <div className="bg-bitcoin-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Prize Amount</div>
              <div className="text-xl font-bold text-bitcoin-orange">{puzzle.prizeAmount} BTC</div>
            </div>
            <div className="bg-bitcoin-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Difficulty</div>
              <div className="text-xl font-bold">{puzzle.difficulty}</div>
            </div>
            <div className="bg-bitcoin-gray p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Exposed PubKey</div>
              <div className="text-xl font-bold">
                {puzzle.hasExposedPubKey ? '✓ Yes' : '✗ No'}
              </div>
            </div>
          </div>

          {/* Search Range */}
          <div className="bg-bitcoin-gray p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-bitcoin-orange mb-2">Search Range</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <span className="text-gray-400">Min:</span> {puzzle.searchRange.min}
              </div>
              <div>
                <span className="text-gray-400">Max:</span> {puzzle.searchRange.max}
              </div>
              <div>
                <span className="text-gray-400">Range Size:</span> {puzzle.searchRange.rangeSize}
              </div>
            </div>
          </div>

          {/* Recommended Method */}
          <div className="bg-bitcoin-gray p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-bitcoin-orange mb-2">Recommended Solving Method</h3>
            <div className="text-lg font-bold">{puzzle.recommendedMethod}</div>
            <p className="text-sm text-gray-400 mt-2">
              {puzzle.hasExposedPubKey 
                ? 'This puzzle has an exposed public key, making BSGS (Baby-Step Giant-Step) or Kangaroo algorithms highly effective.'
                : 'No exposed public key available. GPU-accelerated brute force is recommended.'}
            </p>
          </div>

          {/* Private Key (if solved) */}
          {puzzle.isSolved && puzzle.privateKey && (
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-500">✓ Solved - Private Key</h3>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded text-sm transition-colors"
                >
                  {showPrivateKey ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showPrivateKey && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Decimal:</span>
                      <button
                        onClick={() => copyToClipboard(puzzle.privateKey, 'decimal')}
                        className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                      >
                        {copiedField === 'decimal' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                      {puzzle.privateKey}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Hexadecimal:</span>
                      <button
                        onClick={() => copyToClipboard(privateKeyHex, 'hex')}
                        className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                      >
                        {copiedField === 'hex' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                      {privateKeyHex}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">WIF (Wallet Import Format):</span>
                      <button
                        onClick={() => copyToClipboard(privateKeyWIF, 'wif')}
                        className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                      >
                        {copiedField === 'wif' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                      {privateKeyWIF}
                    </div>
                  </div>

                  {address && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-sm">Bitcoin Address:</span>
                        <button
                          onClick={() => copyToClipboard(address, 'address')}
                          className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                        >
                          {copiedField === 'address' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                        {address}
                      </div>
                    </div>
                  )}

                  {publicKey && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-sm">Public Key:</span>
                        <button
                          onClick={() => copyToClipboard(publicKey, 'pubkey')}
                          className="text-xs text-bitcoin-orange hover:text-bitcoin-orange/80"
                        >
                          {copiedField === 'pubkey' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                        {publicKey}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Predictions (if unsolved) */}
          {!puzzle.isSolved && puzzle.prediction && (
            <div className="bg-bitcoin-orange/10 border border-bitcoin-orange/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-bitcoin-orange mb-4">Mathematical Predictions</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Logarithmic Formula Prediction:</div>
                  <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                    {puzzle.prediction.logarithmic}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm mb-1">Recurrence Relation Prediction (Recommended):</div>
                  <div className="bg-bitcoin-darker p-2 rounded font-mono text-sm break-all">
                    {puzzle.prediction.recurrence}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-gray-400 text-sm">Confidence Level:</div>
                    <div className="text-lg font-bold text-bitcoin-orange">
                      {puzzle.prediction.confidence}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Error Margin:</div>
                    <div className="text-lg font-bold">
                      {puzzle.prediction.errorMargin}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-bitcoin-darker rounded text-sm text-gray-400">
                <strong>Note:</strong> These are mathematical predictions based on patterns in solved puzzles. 
                The recurrence relation typically provides more accurate estimates.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
