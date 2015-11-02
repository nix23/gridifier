/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Dom.init();

SizesResolver.init();

var gridifier = this;

var srManager = new SizesResolverManager();

var gridItem = new Item();

var grid = new Grid();

var ev = new EventEmitter();

var settings = new Settings();

var core = new Core();

var eq = bind("eq", settings);

var collector = new Collector();

var guid = new GUID();

var antialiaser = new Antialiaser();

var rounder = new Rounder();

var operation = new Operation();

var imagesLoader = new ImagesLoader();

var connectors = new Connectors();

var crsCleaner = new CrsCleaner();

var crsIntersector = new CrsIntersector();

var repositionCrs = new RepositionCrs();

var crsRounder = new CrsRounder();

var crsSelector = new CrsSelector();

var crsShifter = new CrsShifter();

var crsSorter = new CrsSorter();

var coordsFinder = eq("grid", "vertical") ? new VgCoordsFinder() : new HgCoordsFinder();

var connections = eq("grid", "vertical") ? new VgConnections() : new HgConnections();

var cnsCore = new CnsCore();

var cnsIntersector = new CnsIntersector();

var cnsRanges = new CnsRanges();

var cnsSorter = new CnsSorter();

var cnsXYIntersector = new CnsXYIntersector();

var cssManager = new CssManager();

var iterator = new Iterator();

var renderer = new Renderer();

var rendererCns = new RendererCns();

var rendererQueue = new RendererQueue();

var silentRenderer = new SilentRenderer();

var appender = eq("grid", "vertical") ? new VgAppender() : new HgAppender();

var prepender = eq("grid", "vertical") ? new VgPrepender() : new HgPrepender();

var reversedAppender = eq("grid", "vertical") ? new VgReversedAppender() : new HgReversedAppender();

var reversedPrepender = eq("grid", "vertical") ? new VgReversedPrepender() : new HgReversedPrepender();

var resorter = new Resorter();

var disconnector = new Disconnector();

var filtrator = new Filtrator();

var reposition = new Reposition();

var repositionQueue = new RepositionQueue();

var repositionData = new RepositionData();

var insertQueue = new InsertQueue();

var appendOp = new AppendOp();

var prependOp = new PrependOp();

var insertOp = new InsertOp();

var ccApi = new CcApi();

var rsortApi = new RsortApi();

var sortHelpers = new SortHelpers();

var toggleApi = new ToggleApi();

var toggleSyncerApi = new ToggleSyncerApi();

var dragifierApi = new DragifierApi();

var discretizerCore = new DiscretizerCore();

var dragifierCore = new DragifierCore();

var dragifierCells = new DragifierCells();

var dragifier = new Dragifier();