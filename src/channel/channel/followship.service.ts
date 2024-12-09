import { ChannelFollowshipType } from "@htkradass/nestcommon";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ChannelFollowship, ChannelFollowshipAttrs, ChannelFollowshipDoc } from "./models/channel-followship.model";

@Injectable()
export class ChannelFollowshipService {

  async createOrUpdate(followship: ChannelFollowshipType) {
    const foundFollowship = await ChannelFollowship.findById(followship.id);
    let createdOrUpdated: ChannelFollowshipDoc;
    if (foundFollowship) {
      // to update
      createdOrUpdated = await ChannelFollowship.findByIdAndUpdate(foundFollowship.id, followship, { new: true });
    } else {
      // to create
      const newFollowship: ChannelFollowshipAttrs = {
        _id: followship.id,
        ...followship,
      }
      createdOrUpdated = await ChannelFollowship.create(newFollowship);
    }

    return createdOrUpdated.toJSON();
  }


  async getLatest() {
    const followship = await ChannelFollowship.find().sort({ _id: -1 }).limit(1);
    return followship;
  }

  async syncFollowship(params) {

    if (params?.followerships.length > 0) {
      console.log(params.followerships);
      for (let i = 0; i < params.followerships.length; i++) {
        // const followship = params.followerships[i];
        let followship = {
          id: params.followerships[i].id,
          joinAt: params.followerships[i].joinAt,
          addedBy: params.followerships[i].addedBy?.id || null,
          channel: params.followerships[i].channel?.id || null,
          user: params.followerships[i].user?.id || null,
          createdAt: params.followerships[i].createdAt,
          updatedAt: params.followerships[i].updatedAt,
          deleted: params.followerships[i].deleted,
        };
        console.log(followship);

        this.createOrUpdate(followship)

      }

    }

    // const followship = await ChannelFollowship.find().sort({ _id: -1 }).limit(1);
    // console.log(followship);

    return { status: true };
  }

  async findById(channelFollwshipId) {
    const channelFollwship = await ChannelFollowship.findById(channelFollwshipId).populate(['channel', 'user', 'addedBy']);
    // return [channelFollwship?.toJSON()]
    let found
    if (channelFollwship) {
      found = [channelFollwship?.toJSON()]
    } else {
      found = []
    }
    return found
  }


  async findFollowshipByUser(userId) {
    const followerships = await ChannelFollowship.find({
      user: userId,
      deleted: false,
    }).populate(['channel', 'user']);
    if (!followerships?.length)
      return []
    return followerships;
  }


}