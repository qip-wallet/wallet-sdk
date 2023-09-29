import {Bitcoin} from "./Bitcoin"
import { applyMixins } from "./utils";

class QipWallet extends Bitcoin {}
interface QipWallet {}

applyMixins(QipWallet, [Bitcoin]);

export default QipWallet;
