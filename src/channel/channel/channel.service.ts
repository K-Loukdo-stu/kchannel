import { ChannelKinds, Currency } from '@htkradass/common';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ExtensionSubscriptionService } from 'src/extension/extension/extension-subscription.service';
import { Product } from 'src/extension/product/models/product.model';
import { ProductService } from 'src/extension/product/product.service';
import { FileDeletedPublisher } from 'src/nats/events/publishers';
import { NatsService } from 'src/nats/nats.service';
import { Channel, ChannelAttrs, ChannelDoc } from './models/channel.model';
import { CreateChannelInput, CreateSyncChannelInput } from './type-defs/channel';
import UpdateChannelCurrencyAndExchangeRateInput from './type-defs/channel/update-channel-currency-and-exchange-rate.input';
import ChannelsInput from './type-defs/channel/channels.input';
const mongoose = require('mongoose');

@Injectable()
export class ChannelService {
  constructor(
    @Inject(forwardRef(() => ProductService)) private productService: ProductService,
    @Inject(forwardRef(() => NatsService)) private natsService: NatsService,
    private extensionSubscriptionService: ExtensionSubscriptionService,
  ) { }

  async create(userId, params: CreateChannelInput): Promise<any> {
    if (params.catalog == '') params.catalog = null;
    let newChannel: ChannelAttrs = {
      ...params,
      createdBy: userId,
      acceptingCurrency: Currency.KHR.code,
      usdExchangeRateInRiel: 4000 // default exchange rate
    }

    if (params.kind == ChannelKinds.CONTENT_CREATOR) {
      // todo
    } else if (params.kind == ChannelKinds.SALE) {
      // add product managment extension
    } else if (params.kind == ChannelKinds.CHAT_ROOM) {
      // todo
    } else {
      throw new BadRequestException("The channel kind is not defined")
    }

    const channel = Channel.build(newChannel)
    const createdChannel = await channel.save();
    const createdChannelObj = createdChannel.toJSON()

    // Nats pub: channel created event
    this.natsService.publish().ChCreated(createdChannelObj);

    const foundCreatedOne = await Channel.findById(channel.id).populate(['catalog', 'createdBy']);
    return foundCreatedOne.toJSON();
  }

  async update(userId, params) {
    const channelId = params.id
    const newUpdate = {
      name: params.name,
      desc: params.desc,
      phone: params.phone,
      email: params.email,
      website: params.website,
      createdBy: params.user,
      profile: params?.profile,
      cover: params?.cover,
    } as Partial<ChannelAttrs>
    const updatedChannel = await Channel.findByIdAndUpdate(channelId, newUpdate, { new: true });
    const updatedChannelObj = updatedChannel.toJSON();

    // Nats pub: channel created event
    this.natsService.publish().ChUpdated(updatedChannelObj);

    const foundUpdatedOne = await Channel.findById(updatedChannel.id).populate(['catalog', 'createdBy']);
    return foundUpdatedOne.toJSON();
  }

  async updateInfo(userId, params) {
    const channelId = params.id
    const newUpdate = {
      name: params.name,
      bio: params.bio,
      desc: params.desc,
      phone: params.phone,
      email: params.email,
      website: params.website,
      createdBy: params.user,
      catalog: params.catalog,
      public: params?.public,
      usdExchangeRateInRiel: params?.usdExchangeRateInRiel,
      acceptingCurrency: params?.acceptingCurrency,
    } as Partial<ChannelAttrs>
    const updatedChannel = await Channel.findByIdAndUpdate(channelId, newUpdate, { new: true });
    const updatedChannelObj = updatedChannel.toJSON();

    // Nats pub: channel created event
    this.natsService.publish().ChUpdated(updatedChannelObj);

    const foundUpdatedOne = await Channel.findById(updatedChannel.id).populate(['catalog', 'createdBy']);
    return foundUpdatedOne.toJSON();
  }

  async updateAddress(userId, params) {
    const channelId = params.id
    const newUpdate = {
      address: params.address,
      latitude: params.latitude,
      longitude: params.longitude
    } as Partial<ChannelAttrs>
    const updatedChannel = await Channel.findByIdAndUpdate(channelId, newUpdate, { new: true });
    const updatedChannelObj = updatedChannel.toJSON();

    // Nats pub: channel created event
    this.natsService.publish().ChUpdated(updatedChannelObj);

    const foundUpdatedOne = await Channel.findById(updatedChannel.id).populate(['catalog', 'createdBy']);
    return foundUpdatedOne.toJSON();
  }

  async updateChannelCurrencyAndExchangeRate(params: UpdateChannelCurrencyAndExchangeRateInput) {
    const { currencyCode, usdExchangeRateInRiel, channelId } = params;
    const newUpdate: Partial<ChannelAttrs> = {
      acceptingCurrency: currencyCode,
      usdExchangeRateInRiel
    };

    const updatedChannel = await Channel.findByIdAndUpdate(channelId, newUpdate, { new: true }).populate(['catalog', 'createdBy']);
    return updatedChannel.toJSON();
  }

  async updateProfile(params) {
    const { id, profile } = params;
    const preChannel = await Channel.findById(id);
    if (!preChannel) throw new BadRequestException("Channel is not found")

    const newUpdate = { profile: profile }
    const updatedChannel = await Channel.findByIdAndUpdate(id, newUpdate, { new: true });

    // NATS: Delete prevous profile in S3 (Storage)
    if (preChannel.profile) {
      this.natsService.getClient(async (client) => {
        await new FileDeletedPublisher(client).publish({
          id: preChannel?.profile?.['id'],
          type: 'channel-profile'
        })
      })
    }

    // Nats pub: channel created event
    this.natsService.publish().ChUpdated(updatedChannel);


    return updatedChannel;
  }

  async updateCover(params) {
    const { id, cover } = params;
    const preChannel = await Channel.findById(id);
    if (!preChannel) throw new BadRequestException("Channel is not found")

    const newUpdate = { cover: cover }
    const updatedChannel = await Channel.findByIdAndUpdate(id, newUpdate, { new: true });

    // NATS: Delete prevous profile in S3 (Storage)
    if (preChannel.cover) {
      this.natsService.getClient(async (client) => {
        await new FileDeletedPublisher(client).publish({
          id: preChannel?.cover?.['id'],
          type: 'channel-cover'
        })
      })
    }

    // Nats pub: channel created event
    this.natsService.publish().ChUpdated(updatedChannel);


    return updatedChannel;
  }

  async deleteSoftly(userId, params) {
    const channelId = params.id
    const found = await Channel.findById(channelId).populate(['catalog', 'createdBy']);
    if (!found) {
      throw new BadRequestException("The channel is not found");
    } else if (found.deleted == true) {
      throw new BadRequestException("The channel is already deleted");
    }

    // delete a channel softly
    const updatedChannel = await Channel.findByIdAndUpdate(channelId, { deleted: true }, { new: true });

    // Nats pub: channel created event
    this.natsService.publish().ChUpdated(updatedChannel);


    return found.toJSON();
  }

  async deleteHardly(userId, params) {
    const channelId = params.id
    const deleteChannel = Channel.findByIdAndDelete(channelId);
    // delete all product and channel type
    await Product.deleteMany({ channel: channelId });
    return deleteChannel;
  }

  async findById(channelId) {
    const channel = await Channel.findById(channelId).populate(['catalog']);
    return channel?.toJSON()
  }

  async findChannelInfo({ channelId }) {
    const channel = await Channel.findById(channelId).populate(['catalog']);
    if (!channel) throw new BadRequestException("The channel is not found")

    let channelInfo: any = channel?.toJSON();

    try {
      const extensionSub = await this.extensionSubscriptionService.findMenuBoardExtensionSubscription({ channelId });
      if (extensionSub?.extension) {
        channelInfo = {
          ...channelInfo,
          menuBoardExtension: extensionSub.extension,
        }
      }
    } catch (_) { }

    return channelInfo;
  }

  async getAllChannels(params: ChannelsInput) {
    const { page, limit, catalog } = params;
    let exprCond = {}
    if (catalog) {
      exprCond = {
        $eq: [mongoose.Types.ObjectId(catalog), "$catalog"]
      }
    }

    const channels = await Channel.aggregate([
      {
        $match: {
          $expr: exprCond
        },
      },
      {
        $lookup: {
          from: "channelcatalogs",
          let: { catalog_id: "$catalog" },
          as: "catalog",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$catalog_id"]
                }
              },
            },
            {
              $project: {
                _id: "$_id",
                id: "$_id",
                name: 1,
                createdAt: 1,
                updatedAt: 1,
              }
            },]
        }
      },
      { "$unwind": { path: "$catalog", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "channelfollowships",
          let: { channel_id: "$_id" },
          as: "followships",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$channel", "$$channel_id"]
                }
              },
            },
            {
              $project: {
                _id: "$_id",
                id: "$_id",
                channel: 1,
                user: 1,
                joinAt: 1,
                addedBy: 1,
                createdAt: 1,
                updatedAt: 1,
              }
            },
          ]
        }
      },
      {
        "$project": {
          id: "$_id",
          name: 1,
          kind: 1,
          desc: 1,
          phone: 1,
          email: 1,
          website: 1,
          bio: 1,
          profile: 1,
          cover: 1,
          catalog: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          followshipCount: { $size: "$followships" }
        }
      },
      {
        $sort: { _id: -1 }
      },
      { $skip: page * limit },
      { $limit: limit }
    ]);

    return channels;
  }

  async findByProductType(params) {
    const channels = await Channel.aggregate([
      {
        $lookup: {
          from: "channeltypes",
          let: { channel_id: "$_id" },
          as: "channelType",
          pipeline: [{
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$channel", "$$channel_id"] },
                  { $eq: ['$productType', mongoose.Types.ObjectId(params.productTypeId)] },
                ]
              }
            }
          }]
        }
      },
      { "$unwind": "$channelType" },
      {
        "$project": {
          id: "$_id",
          name: 1,
          desc: 1,
          phone: 1,
          email: 1,
          website: 1,
          channelTypes: 1,
          createdBy: 1,
          //profile: 1,
          //cover: 1
        }
      }
    ]).skip(params.page * 10).limit(10);

    if (!channels?.length)
      return []
    return channels;
  }

  async findChannelByUser(userId) {
    const channels = await Channel.find({
      createdBy: userId,
      deleted: false,
    });
    if (!channels?.length)
      return []
    return channels;
  }


  async searchChannels(searchText?: string, currentPage?: number, limit = 15) {
    if (currentPage === 0) {
      currentPage = 1
    }
    currentPage = currentPage - 1
    let cond = {
      $or: [{ name: { $regex: '.*' + searchText + '.*', $options: "ix" } }, { desc: { $regex: '.*' + searchText + '.*', $options: "ix" } }]
    }

    const channels = await Channel.aggregate(
      [
        {
          $match: cond
        },
        {
          $lookup: {
            from: "channelcatalogs",
            let: { catalog_id: "$catalog" },
            as: "catalog",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$catalog_id"]
                  }
                },
              },
              {
                $project: {
                  _id: "$_id",
                  id: "$_id",
                  name: 1,
                  createdAt: 1,
                  updatedAt: 1,
                }
              },]
          }
        },
        { "$unwind": { path: "$catalog", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "channelfollowships",
            let: { channel_id: "$_id" },
            as: "followships",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$channel", "$$channel_id"]
                  }
                },
              },
              {
                $project: {
                  _id: "$_id",
                  id: "$_id",
                  channel: 1,
                  user: 1,
                  joinAt: 1,
                  addedBy: 1,
                  createdAt: 1,
                  updatedAt: 1,
                }
              },
            ]
          }
        },
        {
          $project: {
            _id: "$_id",
            id: "$_id",
            name: 1,
            kind: 1,
            desc: 1,
            phone: 1,
            email: 1,
            website: 1,
            bio: 1,
            profile: 1,
            cover: 1,
            catalog: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
            followshipCount: { $size: "$followships" }
          }
        },
        {
          $sort: { _id: -1 }
        },
        { $skip: currentPage * limit },
        { $limit: limit }
      ]
    );

    const channelTotal = await Channel.count();
    const pageTotal = Math.ceil(channelTotal / limit)
    return {
      channels: channels || [],
      pageTotal,
      channelTotal,
    };
  }

  async getLatest() {
    const channel = await Channel.find().sort({ _id: -1 }).limit(1);
    return channel;
  }

  async findChannelById(channelId) {
    const channel = await Channel.findById(channelId).populate(['catalog', 'createdBy']);
    let found
    if (channel) {
      found = [channel?.toJSON()]
    } else {
      found = []
    }
    return found
    // return [channel?.toJSON()]
  }

  async createOrUpdate(params: CreateSyncChannelInput): Promise<any> {
    const foundChannel = await Channel.findById(params.id);
    let createdOrUpdated: ChannelDoc;
    if (foundChannel) {
      // to update
      createdOrUpdated = await Channel.findByIdAndUpdate(foundChannel.id, params, { new: true });
    } else {
      // to create
      let newChannel: ChannelAttrs = {
        _id: params.id,
        ...params,
        createdBy: params.createdBy,
        acceptingCurrency: Currency.KHR.code,
        usdExchangeRateInRiel: 4000 // default exchange rate
      }

      if (params.kind == ChannelKinds.CONTENT_CREATOR) {
        // todo
      } else if (params.kind == ChannelKinds.SALE) {
        // add product managment extension
      } else if (params.kind == ChannelKinds.CHAT_ROOM) {
        // todo
      } else {
        throw new BadRequestException("The channel kind is not defined")
      }

      const channel = Channel.build(newChannel)
      const createdChannel = await channel.save();
      const createdChannelObj = createdChannel.toJSON()

      // Nats pub: channel created event
      this.natsService.publish().ChCreated(createdChannelObj);

      createdOrUpdated = await Channel.findById(channel.id).populate(['catalog', 'createdBy']);
    }


    return createdOrUpdated.toJSON();
  }

  async syncChannels(params) {

    if (params?.channels.length > 0) {
      for (let i = 0; i < params.channels.length; i++) {
        // const followship = params.channels[i];
        let channel = {
          id: params.channels[i].id,
          createdBy: params.channels[i].createdBy?.id || null,
          createdAt: params.channels[i].createdAt,
          updatedAt: params.channels[i].updatedAt,
          name: params.channels[i].name,
          desc: params.channels[i].desc,
          phone: params.channels[i].phone,
          email: params.channels[i].email,
          website: params.channels[i].website,
          bio: params.channels[i].bio,
          profile: params.channels[i].profile,
          cover: params.channels[i].cover,
          kind: params.channels[i].kind,
        };
        this.createOrUpdate(channel)
      }

    }

    return { status: true };
  }

}
